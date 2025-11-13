import z from "zod"
import { sanitizeObject } from "../utils/zodHandler"



export const getUserTicketsQuerySchema = sanitizeObject(z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  
  // Filter by ticket status
  status: z.enum(['ACTIVE', 'USED', 'REFUNDED', 'CANCELLED', 'EXPIRED']).optional(),
  
  // Filter by event timing
  eventTiming: z.enum(['upcoming', 'past', 'today']).optional(),
  
  // Filter by event status
  eventStatus: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']).optional(),
  
  // Search by event title or ticket ID
  search: z.string().optional(),
  
  // Sort options
  sortBy: z.enum(['createdAt', 'issuedAt', 'eventStartDate', 'eventEndDate']).default('eventStartDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),          
}))

