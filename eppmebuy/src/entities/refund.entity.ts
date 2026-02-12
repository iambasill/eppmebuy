import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { RefundStatus } from './enums/index.js';
import { Order } from './order.entity.js';

@Entity('refunds')
@Index(['orderId'])
export class Refund {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'order_id' })
    orderId: string;

    @ManyToOne(() => Order, (order) => order.refunds, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ name: 'amount_cents' })
    amountCents: number;

    @Column({ default: 'USD' })
    currency: string;

    @Column({ type: 'text', nullable: true })
    reason: string;

    @Column({ type: 'enum', enum: RefundStatus, default: RefundStatus.PENDING })
    status: RefundStatus;

    @Column({ name: 'refund_id', nullable: true })
    refundId: string;

    @Column({ name: 'requested_at', default: () => 'CURRENT_TIMESTAMP' })
    requestedAt: Date;

    @Column({ name: 'processed_at', nullable: true })
    processedAt: Date;
}
