import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Ticket } from '../../entities/ticket.entity.js';
import { Order } from '../../entities/order.entity.js';
import { EventStatus, TicketStatus } from '../../entities/enums/index.js';
import { GetMyTicketsDto, EventTiming } from './dto/get-my-tickets.dto.js';

@Injectable()
export class TicketService {
    constructor(
        @InjectRepository(Ticket)
        private readonly ticketRepository: Repository<Ticket>,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
    ) { }

    async getMyTickets(userId: string, query: GetMyTicketsDto) {
        const {
            page = 1,
            limit = 10,
            status,
            eventTiming,
            eventStatus,
            search,
            sortBy,
            sortOrder,
        } = query;

        const skip = (page - 1) * limit;
        const now = new Date();

        const qb = this.ticketRepository
            .createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.event', 'event')
            .leftJoinAndSelect('event.host', 'host')
            .leftJoinAndSelect('ticket.ticketTier', 'ticketTier')
            .leftJoinAndSelect('ticket.order', 'order')
            .leftJoinAndSelect('ticket.checkIns', 'checkIns')
            .where('ticket.ownerId = :userId', { userId });

        // Filter by ticket status
        if (status) {
            qb.andWhere('ticket.status = :status', { status });
        }

        // Filter by event status
        if (eventStatus) {
            qb.andWhere('event.status = :eventStatus', { eventStatus });
        }

        // Filter by event timing
        if (eventTiming === EventTiming.UPCOMING) {
            qb.andWhere('event.startDateTime >= :now', { now });
        } else if (eventTiming === EventTiming.PAST) {
            qb.andWhere('event.endDateTime < :now', { now });
        } else if (eventTiming === EventTiming.TODAY) {
            const startOfDay = new Date(now);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(now);
            endOfDay.setHours(23, 59, 59, 999);

            qb.andWhere('event.startDateTime <= :endOfDay', { endOfDay });
            qb.andWhere('event.endDateTime >= :startOfDay', { startOfDay });
        }

        // Search
        if (search) {
            qb.andWhere(
                new Brackets((qb) => {
                    qb.where('event.title ILIKE :search', { search: `%${search}%` })
                        .orWhere('ticket.id ILIKE :search', { search: `%${search}%` });
                }),
            );
        }

        // Sorting
        if (sortBy === 'eventStartDate') {
            qb.orderBy('event.startDateTime', sortOrder === 'desc' ? 'DESC' : 'ASC');
        } else if (sortBy === 'eventEndDate') {
            qb.orderBy('event.endDateTime', sortOrder === 'desc' ? 'DESC' : 'ASC');
        } else {
            qb.orderBy(`ticket.${sortBy}`, sortOrder === 'desc' ? 'DESC' : 'ASC');
        }

        // Apply pagination
        qb.skip(skip).take(limit);

        const [tickets, total] = await qb.getManyAndCount();

        // Enrich tickets with computed fields
        const enrichedTickets = tickets.map((ticket) => {
            const event = ticket.event;
            const startDate = new Date(event.startDateTime);
            const endDate = new Date(event.endDateTime);
            let eventTimingStatus = 'past';

            if (now < startDate) {
                eventTimingStatus = 'upcoming';
            } else if (now >= startDate && now <= endDate) {
                eventTimingStatus = 'ongoing';
            }

            return {
                ...ticket,
                eventTimingStatus,
                isCheckedIn: ticket.checkIns && ticket.checkIns.length > 0,
                lastCheckIn: ticket.checkIns?.[0] || null,
                canCheckIn:
                    ticket.status === TicketStatus.ACTIVE &&
                    event.status === EventStatus.PUBLISHED &&
                    eventTimingStatus !== 'past',
            };
        });

        return {
            data: enrichedTickets,
            total,
            page,
            limit,
        };
    }

    async getMyTicketById(userId: string, ticketId: string) {
        const ticket = await this.ticketRepository.findOne({
            where: [
                { id: ticketId, ownerId: userId },
                { ticketId: ticketId, ownerId: userId },
            ],
            relations: [
                'event',
                'event.host',
                'ticketTier',
                'order',
                'order.orderItems',
                'checkIns',
                'checkIns.scanner',
            ],
            order: {
                checkIns: {
                    checkedInAt: 'DESC',
                },
            },
        });

        if (!ticket) {
            throw new NotFoundException('Ticket not found');
        }

        // Add computed fields
        const now = new Date();
        const startDate = new Date(ticket.event.startDateTime);
        const endDate = new Date(ticket.event.endDateTime);
        let eventTimingStatus = 'past';

        if (now < startDate) {
            eventTimingStatus = 'upcoming';
        } else if (now >= startDate && now <= endDate) {
            eventTimingStatus = 'ongoing';
        }

        const isRefundable =
            ticket.status === TicketStatus.ACTIVE &&
            ticket.event.refundableUntil &&
            new Date(ticket.event.refundableUntil) > now;

        return {
            ...ticket,
            eventTimingStatus,
            isCheckedIn: ticket.checkIns && ticket.checkIns.length > 0,
            canCheckIn:
                ticket.status === TicketStatus.ACTIVE &&
                ticket.event.status === EventStatus.PUBLISHED &&
                eventTimingStatus !== 'past',
            canRefund: isRefundable,
        };
    }

    async getMyTicketStats(userId: string) {
        const now = new Date();

        const [
            totalTickets,
            upcomingTickets,
            pastTickets,
            usedTickets,
            activeTickets,
            totalSpentResult,
        ] = await Promise.all([
            // Total tickets
            this.ticketRepository.count({ where: { ownerId: userId } }),

            // Upcoming event tickets
            this.ticketRepository
                .createQueryBuilder('ticket')
                .leftJoin('ticket.event', 'event')
                .where('ticket.ownerId = :userId', { userId })
                .andWhere('ticket.status = :status', { status: TicketStatus.ACTIVE })
                .andWhere('event.startDateTime >= :now', { now })
                .getCount(),

            // Past event tickets
            this.ticketRepository
                .createQueryBuilder('ticket')
                .leftJoin('ticket.event', 'event')
                .where('ticket.ownerId = :userId', { userId })
                .andWhere('event.endDateTime < :now', { now })
                .getCount(),

            // Used tickets
            this.ticketRepository.count({
                where: { ownerId: userId, status: TicketStatus.USED },
            }),

            // Active tickets
            this.ticketRepository.count({
                where: { ownerId: userId, status: TicketStatus.ACTIVE },
            }),

            // Total money spent
            this.orderRepository
                .createQueryBuilder('order')
                .select('SUM(order.totalCents)', 'total')
                .where('order.userId = :userId', { userId })
                .andWhere('order.status = :status', { status: 'CONFIRMED' })
                .andWhere('order.paymentStatus = :paymentStatus', {
                    paymentStatus: 'SUCCEEDED',
                })
                .getRawOne(),
        ]);

        return {
            totalTickets,
            upcomingTickets,
            pastTickets,
            usedTickets,
            activeTickets,
            totalSpentCents: totalSpentResult ? parseInt(totalSpentResult.total || '0', 10) : 0,
        };
    }
}
