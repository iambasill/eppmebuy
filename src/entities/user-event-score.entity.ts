import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    Index,
} from 'typeorm';

@Entity('user_event_scores')
@Unique(['userId', 'eventId'])
@Index(['userId', 'score'])
@Index(['computedAt'])
export class UserEventScore {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ name: 'event_id' })
    eventId: string;

    @Column({ type: 'float' })
    score: number;

    @Column({ name: 'collaborative_score', type: 'float', nullable: true })
    collaborativeScore: number;

    @Column({ name: 'content_score', type: 'float', nullable: true })
    contentScore: number;

    @Column({ name: 'popularity_score', type: 'float', nullable: true })
    popularityScore: number;

    @Column({ name: 'recency_score', type: 'float', nullable: true })
    recencyScore: number;

    @Column({ name: 'computed_at' })
    computedAt: Date;
}
