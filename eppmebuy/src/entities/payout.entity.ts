import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { PayoutStatus } from './enums/index.js';
import { User } from './user.entity.js';

@Entity('payouts')
@Index(['hostId'])
@Index(['status'])
export class Payout {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'host_id' })
    hostId: string;

    @ManyToOne(() => User, (user) => user.payouts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'host_id' })
    host: User;

    @Column({ name: 'amount_cents' })
    amountCents: number;

    @Column({ default: 'USD' })
    currency: string;

    @Column()
    provider: string;

    @Column({ name: 'payout_id', nullable: true })
    payoutId: string;

    @Column({ type: 'enum', enum: PayoutStatus, default: PayoutStatus.PENDING })
    status: PayoutStatus;

    @Column({ name: 'period_start' })
    periodStart: Date;

    @Column({ name: 'period_end' })
    periodEnd: Date;

    @Column({ name: 'order_count' })
    orderCount: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'processed_at', nullable: true })
    processedAt: Date;
}
