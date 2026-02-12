import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Index,
} from 'typeorm';
import { TicketStatus } from './enums/index.js';
import { Order } from './order.entity.js';
import { Event } from './event.entity.js';
import { TicketTier } from './ticket-tier.entity.js';
import { User } from './user.entity.js';
import { CheckIn } from './check-in.entity.js';

@Entity('tickets')
@Index(['orderId'])
@Index(['eventId'])
@Index(['ownerId'])
@Index(['status'])
export class Ticket {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'ticket_id', unique: true })
    ticketId: string;

    @Column({ name: 'order_id' })
    orderId: string;

    @ManyToOne(() => Order, (order) => order.tickets, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ name: 'event_id' })
    eventId: string;

    @ManyToOne(() => Event, (event) => event.tickets, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'event_id' })
    event: Event;

    @Column({ name: 'ticket_tier_id' })
    ticketTierId: string;

    @ManyToOne(() => TicketTier, (tier) => tier.tickets)
    @JoinColumn({ name: 'ticket_tier_id' })
    ticketTier: TicketTier;

    @Column({ name: 'owner_id' })
    ownerId: string;

    @ManyToOne(() => User, (user) => user.tickets, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'owner_id' })
    owner: User;

    @Column({ name: 'issued_to_name' })
    issuedTo: string;

    @Column({ name: 'issued_to_email' })
    issuedToEmail: string;

    @Column({ name: 'seat_number' })
    seatNumber: string;

    @Column({ name: 'seat_zone', nullable: true })
    seatZone: string;

    @Column({ name: 'qr_code_data' })
    qrCodeData: string;

    @Column({ name: 'qr_code_image_url' })
    qrCodeImageUrl: string;

    @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.ACTIVE })
    status: TicketStatus;

    @Column({ name: 'issued_at', default: () => 'CURRENT_TIMESTAMP' })
    issuedAt: Date;

    @Column({ name: 'expires_at', nullable: true })
    expiresAt: Date;

    @Column({ name: 'used_at', nullable: true })
    usedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => CheckIn, (ci) => ci.ticket)
    checkIns: CheckIn[];
}
