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

@Entity('add_ons')
@Index(['eventId'])
export class AddOn {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'event_id' })
    eventId: string;

    @ManyToOne(() => Event, (event) => event.addOns, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'event_id' })
    event: Event;

    @Column({ nullable: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'price_cents' })
    priceCents: number;

    @Column({ default: 'USD' })
    currency: string;

    @Column({ nullable: true })
    quantity: number;

    @Column({ name: 'quantity_sold', default: 0 })
    quantitySold: number;

    @Column({ name: 'is_visible', default: true })
    isVisible: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => OrderItem, (oi) => oi.addOn)
    orderItems: OrderItem[];
}
