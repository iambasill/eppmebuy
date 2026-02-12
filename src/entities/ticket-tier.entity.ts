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
import { Event } from './event.entity.js';
import { OrderItem } from './order-item.entity.js';
import { Ticket } from './ticket.entity.js';

@Entity('ticket_tiers')
@Index(['eventId'])
export class TicketTier {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'event_id' })
    eventId: string;

    @ManyToOne(() => Event, (event) => event.ticketTiers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'event_id' })
    event: Event;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'price_cents' })
    priceCents: number;

    @Column({ default: 'NGN' })
    currency: string;

    @Column()
    quantity: number;

    @Column({ name: 'quantity_sold', default: 0 })
    quantitySold: number;

    @Column({ name: 'sales_start' })
    salesStart: Date;

    @Column({ name: 'sales_end' })
    salesEnd: Date;

    @Column({ name: 'is_refundable', default: true })
    isRefundable: boolean;

    @Column({ name: 'refundable_until', nullable: true })
    refundableUntil: Date;

    @Column('simple-array', { nullable: true })
    features: string[];

    @Column({ name: 'has_reserved_seating', default: false })
    hasReservedSeating: boolean;

    @Column({ name: 'seat_zone', nullable: true })
    seatZone: string;

    @Column({ name: 'is_visible', default: true })
    isVisible: boolean;

    @Column({ name: 'sort_order', default: 0 })
    sortOrder: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => OrderItem, (oi) => oi.ticketTier)
    orderItems: OrderItem[];

    @OneToMany(() => Ticket, (ticket) => ticket.ticketTier)
    tickets: Ticket[];
}
