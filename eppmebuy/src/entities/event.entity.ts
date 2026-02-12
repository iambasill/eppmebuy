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
import { EventStatus, EventAccessType } from './enums/index.js';
import { User } from './user.entity.js';
import { TicketTier } from './ticket-tier.entity.js';
import { AddOn } from './add-on.entity.js';
import { PromoCode } from './promo-code.entity.js';
import { Order } from './order.entity.js';
import { Ticket } from './ticket.entity.js';
import { CheckIn } from './check-in.entity.js';
import { Review } from './review.entity.js';
import { UserInteraction } from './user-interaction.entity.js';
import { Favorite } from './favorite.entity.js';

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ unique: true })
    slug: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column('simple-array', { nullable: true })
    coverImages: string[];

    @Column()
    startDateTime: Date;

    @Column()
    endDateTime: Date;

    @Column({ nullable: true })
    venueName: string;

    @Column({ nullable: true })
    venueAddress: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    country: string;

    @Column({ default: false })
    isOnline: boolean;

    @Column({ nullable: true })
    streamingUrl: string;

    @Column({ type: 'enum', enum: EventStatus, default: EventStatus.DRAFT })
    status: EventStatus;

    @Column({ type: 'enum', enum: EventAccessType, default: EventAccessType.PUBLIC })
    accessType: EventAccessType;

    @Column({ nullable: true })
    timezone: string;

    @Column({ nullable: true })
    category: string;

    @Column({ nullable: true })
    refundableUntil: Date;

    @Column({ name: 'host_id' })
    hostId: string;

    @ManyToOne(() => User, (user) => user.hostedEvents, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'host_id' })
    host: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relations
    @OneToMany(() => TicketTier, (tier) => tier.event)
    ticketTiers: TicketTier[];

    @OneToMany(() => AddOn, (addOn) => addOn.event)
    addOns: AddOn[];

    @OneToMany(() => PromoCode, (pc) => pc.event)
    promoCodes: PromoCode[];

    @OneToMany(() => Order, (order) => order.event)
    orders: Order[];

    @OneToMany(() => Ticket, (ticket) => ticket.event)
    tickets: Ticket[];

    @OneToMany(() => CheckIn, (ci) => ci.event)
    checkIns: CheckIn[];

    @OneToMany(() => Review, (review) => review.event)
    reviews: Review[];

    @OneToMany(() => UserInteraction, (ui) => ui.event)
    interactions: UserInteraction[];

    @OneToMany(() => Favorite, (fav) => fav.event)
    favorites: Favorite[];
}
