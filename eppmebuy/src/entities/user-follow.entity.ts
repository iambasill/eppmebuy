import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
    Index,
} from 'typeorm';
import { User } from './user.entity.js';

@Entity('user_follows')
@Unique(['followerId', 'followingId'])
@Index(['followerId'])
@Index(['followingId'])
export class UserFollow {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'follower_id' })
    followerId: string;

    @Column({ name: 'following_id' })
    followingId: string;

    @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'follower_id' })
    follower: User;

    @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'following_id' })
    following: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
