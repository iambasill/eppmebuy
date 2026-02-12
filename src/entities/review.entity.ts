import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
    Index,
} from 'typeorm';
import { User } from './user.entity.js';
import { Event } from './event.entity.js';

@Entity('reviews')
@Unique(['userId', 'eventId'])
@Index(['eventId'])
@Index(['rating'])
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'event_id' })
    eventId: string;

    @ManyToOne(() => Event, (event) => event.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'event_id' })
    event: Event;

    @Column()
    rating: number;

    @Column({ nullable: true })
    title: string;

    @Column({ type: 'text', nullable: true })
    comment: string;

    @Column({ name: 'is_verified_attendee', default: false })
    isVerifiedAttendee: boolean;

    @Column({ name: 'helpful_count', default: 0 })
    helpfulCount: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
