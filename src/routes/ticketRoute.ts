import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { getMyTicketByIdController, getMyTicketsController, getMyTicketStatsController } from '../controller/ticketController';

export const ticketRoute = express.Router();


ticketRoute.post('/tickets/my-tickets', authMiddleware,getMyTicketsController)
ticketRoute.post('/tickets/my-tickets/:ticketId',authMiddleware, getMyTicketByIdController)
ticketRoute.post('/tickets/stats', authMiddleware,getMyTicketStatsController)
