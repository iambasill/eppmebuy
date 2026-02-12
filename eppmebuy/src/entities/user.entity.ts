import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index,
} from 'typeorm';
import { UserRole, UserStatus } from './enums/index.js';
import { UserFollow } from './user-follow.entity.js';
import { PaymentMethod } from './payment-method.entity.js';
import { Order } from './order.entity.js';
import { Ticket } from './ticket.entity.js';
import { Review } from './review.entity.js';
import { UserInteraction } from './user-interaction.entity.js';
import { Favorite } from './favorite.entity.js';
import { SearchHistory } from './search-history.entity.js';
import { Notification } from './notification.entity.js';
import { Payout } from './payout.entity.js';
import { CheckIn } from './check-in.entity.js';
import { Event } from './event.entity.js';
import { CustomerSupport } from './customer-support.entity.js';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.ATTENDEE })
    role: UserRole;

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @Column({ nullable: true })
    googleId: string;

    @Column({ nullable: true })
    facebookId: string;

    @Column({ default: false })
    emailVerified: boolean;

    @Column({ nullable: true })
    profilePictureUrl: string;

    @Column({ nullable: true })
    organizationName: string;

    @Column({ nullable: true })
    contactEmail: string;

    @Column({ nullable: true })
    contactPhone: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relations
    @OneToMany(() => UserFollow, (follow) => follow.follower)
    following: UserFollow[];

    @OneToMany(() => UserFollow, (follow) => follow.following)
    followers: UserFollow[];

    @OneToMany(() => PaymentMethod, (pm) => pm.user)
    paymentMethods: PaymentMethod[];

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @OneToMany(() => Ticket, (ticket) => ticket.owner)
    tickets: Ticket[];

    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[];

    @OneToMany(() => UserInteraction, (interaction) => interaction.user)
    interactions: UserInteraction[];

    @OneToMany(() => Favorite, (fav) => fav.user)
    favorites: Favorite[];

    @OneToMany(() => SearchHistory, (sh) => sh.user)
    searchHistory: SearchHistory[];

    @OneToMany(() => Notification, (n) => n.user)
    notifications: Notification[];

    @OneToMany(() => Payout, (p) => p.host)
    payouts: Payout[];

    @OneToMany(() => CheckIn, (ci) => ci.scanner)
    scannedCheckIns: CheckIn[];

    @OneToMany(() => Event, (e) => e.host)
    hostedEvents: Event[];

    @OneToMany(() => CustomerSupport, (cs) => cs.user)
    supportRequests: CustomerSupport[];
}
