"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ticket_entity_js_1 = require("../../entities/ticket.entity.js");
const order_entity_js_1 = require("../../entities/order.entity.js");
const index_js_1 = require("../../entities/enums/index.js");
const get_my_tickets_dto_js_1 = require("./dto/get-my-tickets.dto.js");
let TicketService = class TicketService {
    ticketRepository;
    orderRepository;
    constructor(ticketRepository, orderRepository) {
        this.ticketRepository = ticketRepository;
        this.orderRepository = orderRepository;
    }
    async getMyTickets(userId, query) {
        const { page = 1, limit = 10, status, eventTiming, eventStatus, search, sortBy, sortOrder, } = query;
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
        if (status) {
            qb.andWhere('ticket.status = :status', { status });
        }
        if (eventStatus) {
            qb.andWhere('event.status = :eventStatus', { eventStatus });
        }
        if (eventTiming === get_my_tickets_dto_js_1.EventTiming.UPCOMING) {
            qb.andWhere('event.startDateTime >= :now', { now });
        }
        else if (eventTiming === get_my_tickets_dto_js_1.EventTiming.PAST) {
            qb.andWhere('event.endDateTime < :now', { now });
        }
        else if (eventTiming === get_my_tickets_dto_js_1.EventTiming.TODAY) {
            const startOfDay = new Date(now);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(now);
            endOfDay.setHours(23, 59, 59, 999);
            qb.andWhere('event.startDateTime <= :endOfDay', { endOfDay });
            qb.andWhere('event.endDateTime >= :startOfDay', { startOfDay });
        }
        if (search) {
            qb.andWhere(new typeorm_2.Brackets((qb) => {
                qb.where('event.title ILIKE :search', { search: `%${search}%` })
                    .orWhere('ticket.id ILIKE :search', { search: `%${search}%` });
            }));
        }
        if (sortBy === 'eventStartDate') {
            qb.orderBy('event.startDateTime', sortOrder === 'desc' ? 'DESC' : 'ASC');
        }
        else if (sortBy === 'eventEndDate') {
            qb.orderBy('event.endDateTime', sortOrder === 'desc' ? 'DESC' : 'ASC');
        }
        else {
            qb.orderBy(`ticket.${sortBy}`, sortOrder === 'desc' ? 'DESC' : 'ASC');
        }
        qb.skip(skip).take(limit);
        const [tickets, total] = await qb.getManyAndCount();
        const enrichedTickets = tickets.map((ticket) => {
            const event = ticket.event;
            const startDate = new Date(event.startDateTime);
            const endDate = new Date(event.endDateTime);
            let eventTimingStatus = 'past';
            if (now < startDate) {
                eventTimingStatus = 'upcoming';
            }
            else if (now >= startDate && now <= endDate) {
                eventTimingStatus = 'ongoing';
            }
            return {
                ...ticket,
                eventTimingStatus,
                isCheckedIn: ticket.checkIns && ticket.checkIns.length > 0,
                lastCheckIn: ticket.checkIns?.[0] || null,
                canCheckIn: ticket.status === index_js_1.TicketStatus.ACTIVE &&
                    event.status === index_js_1.EventStatus.PUBLISHED &&
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
    async getMyTicketById(userId, ticketId) {
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
            throw new common_1.NotFoundException('Ticket not found');
        }
        const now = new Date();
        const startDate = new Date(ticket.event.startDateTime);
        const endDate = new Date(ticket.event.endDateTime);
        let eventTimingStatus = 'past';
        if (now < startDate) {
            eventTimingStatus = 'upcoming';
        }
        else if (now >= startDate && now <= endDate) {
            eventTimingStatus = 'ongoing';
        }
        const isRefundable = ticket.status === index_js_1.TicketStatus.ACTIVE &&
            ticket.event.refundableUntil &&
            new Date(ticket.event.refundableUntil) > now;
        return {
            ...ticket,
            eventTimingStatus,
            isCheckedIn: ticket.checkIns && ticket.checkIns.length > 0,
            canCheckIn: ticket.status === index_js_1.TicketStatus.ACTIVE &&
                ticket.event.status === index_js_1.EventStatus.PUBLISHED &&
                eventTimingStatus !== 'past',
            canRefund: isRefundable,
        };
    }
    async getMyTicketStats(userId) {
        const now = new Date();
        const [totalTickets, upcomingTickets, pastTickets, usedTickets, activeTickets, totalSpentResult,] = await Promise.all([
            this.ticketRepository.count({ where: { ownerId: userId } }),
            this.ticketRepository
                .createQueryBuilder('ticket')
                .leftJoin('ticket.event', 'event')
                .where('ticket.ownerId = :userId', { userId })
                .andWhere('ticket.status = :status', { status: index_js_1.TicketStatus.ACTIVE })
                .andWhere('event.startDateTime >= :now', { now })
                .getCount(),
            this.ticketRepository
                .createQueryBuilder('ticket')
                .leftJoin('ticket.event', 'event')
                .where('ticket.ownerId = :userId', { userId })
                .andWhere('event.endDateTime < :now', { now })
                .getCount(),
            this.ticketRepository.count({
                where: { ownerId: userId, status: index_js_1.TicketStatus.USED },
            }),
            this.ticketRepository.count({
                where: { ownerId: userId, status: index_js_1.TicketStatus.ACTIVE },
            }),
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
    async createTicket(data) {
        const ticket = this.ticketRepository.create({
            ...data,
            ticketId: data.ticketId || `TKT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            qrCodeData: data.qrCodeData || `QR-${Math.random().toString(36).substring(2, 15)}`,
            qrCodeImageUrl: data.qrCodeImageUrl || 'https://placeholder.com/qr',
            status: index_js_1.TicketStatus.ACTIVE,
            seatNumber: data.seatNumber || 'N/A',
        });
        return await this.ticketRepository.save(ticket);
    }
};
exports.TicketService = TicketService;
exports.TicketService = TicketService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ticket_entity_js_1.Ticket)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_js_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TicketService);
//# sourceMappingURL=ticket.service.js.map