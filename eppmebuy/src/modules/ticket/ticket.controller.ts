import { Controller, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { TicketService } from './ticket.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { GetMyTicketsDto } from './dto/get-my-tickets.dto.js';
import { ApiResponse } from '../../common/dto/api-response.dto.js';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketController {
    constructor(private readonly ticketService: TicketService) { }

    @Post('my-tickets')
    async getMyTickets(@Req() req: Request, @Body() query: GetMyTicketsDto) {
        const user = (req as any).user;
        const result = await this.ticketService.getMyTickets(user.id, query);

        return ApiResponse.paginated(result.data, {
            page: result.page,
            limit: result.limit,
            total: result.total,
        });
    }

    @Post('stats')
    async getMyTicketStats(@Req() req: Request) {
        const user = (req as any).user;
        const stats = await this.ticketService.getMyTicketStats(user.id);

        return ApiResponse.success(stats);
    }

    @Post('my-tickets/:ticketId')
    async getMyTicketById(
        @Req() req: Request,
        @Param('ticketId') ticketId: string,
    ) {
        const user = (req as any).user;
        const ticket = await this.ticketService.getMyTicketById(user.id, ticketId);

        return ApiResponse.success(ticket);
    }
}
