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
import { OrderStatus, PaymentStatus } from './enums/index.js';
import { User } from './user.entity.js';
import { Event } from './event.entity.js';
import { PromoCode } from './promo-code.entity.js';
import { OrderItem } from './order-item.entity.js';
import { Ticket } from './ticket.entity.js';
import { Refund } from './refund.entity.js';

@Entity('orders')
@Index(['userId'])
@Index(['eventId'])
@Index(['status'])
@Index(['createdAt'])
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'order_reference', unique: true })
    orderReference: string;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'event_id' })
    eventId: string;

    @ManyToOne(() => Event, (event) => event.orders, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'event_id' })
    event: Event;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    @Column({ name: 'subtotal_cents' })
    subtotalCents: number;

    @Column({ name: 'platform_fee_cents' })
    platformFeeCents: number;

    @Column({ name: 'host_fee_cents', default: 0 })
    hostFeeCents: number;

    @Column({ name: 'tax_cents', default: 0 })
    taxCents: number;

    @Column({ name: 'discount_cents', default: 0 })
    discountCents: number;

    @Column({ name: 'total_cents' })
    totalCents: number;

    @Column({ default: 'USD' })
    currency: string;

    @Column({ name: 'promo_code_id', nullable: true })
    promoCodeId: string;

    @ManyToOne(() => PromoCode, (pc) => pc.orders, { nullable: true })
    @JoinColumn({ name: 'promo_code_id' })
    promoCode: PromoCode;

    @Column({ name: 'attendee_info', type: 'jsonb', nullable: true })
    attendeeInfo: any;

    @Column({ name: 'payment_provider', nullable: true })
    paymentProvider: string;

    @Column({ name: 'payment_intent_id', nullable: true })
    paymentIntentId: string;

    @Column({
        name: 'payment_status',
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    paymentStatus: PaymentStatus;

    @Column({ name: 'paid_at', nullable: true })
    paidAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => OrderItem, (oi) => oi.order)
    orderItems: OrderItem[];

    @OneToMany(() => Ticket, (ticket) => ticket.order)
    tickets: Ticket[];

    @OneToMany(() => Refund, (refund) => refund.order)
    refunds: Refund[];
}
