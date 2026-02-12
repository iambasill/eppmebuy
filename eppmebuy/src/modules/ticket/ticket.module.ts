import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketController } from './ticket.controller.js';
import { TicketService } from './ticket.service.js';
import { Ticket } from '../../entities/ticket.entity.js';
import { Order } from '../../entities/order.entity.js';
import { User } from '../../entities/user.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([Ticket, Order, User]),
        AuthModule,
    ],
    controllers: [TicketController],
    providers: [TicketService],
})
export class TicketModule { }
