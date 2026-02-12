import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity.js';

@Entity('customer_support')
export class CustomerSupport {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => User, (user) => user.supportRequests, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ nullable: true })
    subject: string;

    @Column({ type: 'text', nullable: true })
    message: string;

    @Column({ nullable: true })
    category: string;

    @Column({ default: 'OPEN' })
    status: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
