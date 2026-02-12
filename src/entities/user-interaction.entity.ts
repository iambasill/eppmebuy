import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { InteractionType } from './enums/index.js';
import { User } from './user.entity.js';
import { Event } from './event.entity.js';

@Entity('user_interactions')
@Index(['userId', 'createdAt'])
@Index(['eventId', 'interactionType'])
export class UserInteraction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => User, (user) => user.interactions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'event_id' })
    eventId: string;

    @ManyToOne(() => Event, (event) => event.interactions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'event_id' })
    event: Event;

    @Column({ name: 'interaction_type', type: 'enum', enum: InteractionType })
    interactionType: InteractionType;

    @Column({ name: 'session_id', nullable: true })
    sessionId: string;

    @Column({ nullable: true })
    source: string;

    @Column({ name: 'device_type', nullable: true })
    deviceType: string;

    @Column({ name: 'duration_seconds', nullable: true })
    durationSeconds: number;

    @Column({ name: 'scroll_depth', nullable: true })
    scrollDepth: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
