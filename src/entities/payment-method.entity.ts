import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { PaymentMethodType } from './enums/index.js';
import { User } from './user.entity.js';

@Entity('payment_methods')
@Index(['userId'])
export class PaymentMethod {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => User, (user) => user.paymentMethods, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'enum', enum: PaymentMethodType })
    type: PaymentMethodType;

    @Column()
    provider: string;

    @Column()
    token: string;

    @Column({ nullable: true })
    last4: string;

    @Column({ nullable: true })
    brand: string;

    @Column({ name: 'expiry_month', nullable: true })
    expiryMonth: number;

    @Column({ name: 'expiry_year', nullable: true })
    expiryYear: number;

    @Column({ name: 'is_default', default: false })
    isDefault: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
