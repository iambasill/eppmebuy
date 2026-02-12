import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { Order } from './order.entity.js';
import { TicketTier } from './ticket-tier.entity.js';
import { AddOn } from './add-on.entity.js';

@Entity('order_items')
@Index(['orderId'])
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'order_id' })
    orderId: string;

    @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ name: 'ticket_tier_id', nullable: true })
    ticketTierId: string;

    @ManyToOne(() => TicketTier, (tier) => tier.orderItems, { nullable: true })
    @JoinColumn({ name: 'ticket_tier_id' })
    ticketTier: TicketTier;

    @Column({ name: 'add_on_id', nullable: true })
    addOnId: string;

    @ManyToOne(() => AddOn, (addOn) => addOn.orderItems, { nullable: true })
    @JoinColumn({ name: 'add_on_id' })
    addOn: AddOn;

    @Column()
    quantity: number;

    @Column({ name: 'unit_price_cents' })
    unitPriceCents: number;

    @Column({ name: 'total_price_cents' })
    totalPriceCents: number;

    @Column({ default: 'USD' })
    currency: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
