import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from './user.entity.js';

@Entity('search_history')
@Index(['userId', 'createdAt'])
export class SearchHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => User, (user) => user.searchHistory, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    query: string;

    @Column({ type: 'jsonb', nullable: true })
    filters: any;

    @Column({ name: 'results_count' })
    resultsCount: number;

    @Column({ name: 'clicked_event_id', nullable: true })
    clickedEventId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
