import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { CheckInMethod } from './enums/index.js';
import { Ticket } from './ticket.entity.js';
import { Event } from './event.entity.js';
import { User } from './user.entity.js';

@Entity('check_ins')
@Index(['ticketId'])
@Index(['eventId'])
export class CheckIn {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'ticket_id' })
    ticketId: string;

    @ManyToOne(() => Ticket, (ticket) => ticket.checkIns, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ticket_id' })
    ticket: Ticket;

    @Column({ name: 'event_id' })
    eventId: string;

    @ManyToOne(() => Event, (event) => event.checkIns, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'event_id' })
    event: Event;

    @Column({ name: 'scanner_id', nullable: true })
    scannerId: string;

    @ManyToOne(() => User, (user) => user.scannedCheckIns, { nullable: true })
    @JoinColumn({ name: 'scanner_id' })
    scanner: User;

    @Column({ type: 'enum', enum: CheckInMethod })
    method: CheckInMethod;

    @Column({ name: 'device_info', type: 'jsonb', nullable: true })
    deviceInfo: any;

    @CreateDateColumn({ name: 'checked_in_at' })
    checkedInAt: Date;
}
