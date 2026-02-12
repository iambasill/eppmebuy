import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Unique,
    Index,
} from 'typeorm';
import { DiscountType } from './enums/index.js';
import { Event } from './event.entity.js';
import { Order } from './order.entity.js';

@Entity('promo_codes')
@Unique(['eventId', 'code'])
@Index(['code'])
export class PromoCode {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'event_id' })
    eventId: string;

    @ManyToOne(() => Event, (event) => event.promoCodes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'event_id' })
    event: Event;

    @Column()
    code: string;

    @Column({ name: 'discount_type', type: 'enum', enum: DiscountType })
    discountType: DiscountType;

    @Column({ name: 'discount_value', type: 'decimal', precision: 10, scale: 2 })
    discountValue: number;

    @Column({ name: 'usage_limit', nullable: true })
    usageLimit: number;

    @Column({ name: 'usage_count', default: 0 })
    usageCount: number;

    @Column({ name: 'valid_from' })
    validFrom: Date;

    @Column({ name: 'valid_until' })
    validUntil: Date;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Order, (order) => order.promoCode)
    orders: Order[];
}
