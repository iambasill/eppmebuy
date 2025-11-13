import express, { Request, Response, NextFunction } from "express";
import { BadRequestError, UnAuthorizedError, NotFoundError } from "../logger/exceptions";
import { prismaclient } from "../lib/prisma-postgres";
import { User, TicketStatus } from "../../generated/prisma";
import { getUserTicketsQuerySchema } from "../validator/ticketValidator";

// ====================== CONTROLLERS ====================== //

/**
 * Get all tickets purchased by the authenticated user
 */
export const getMyTicketsController = async (req: Request, res: Response) => {
  const user = req.user as User;
  const query = getUserTicketsQuerySchema.parse(req.query);
  
  const {
    page,
    limit,
    status,
    eventTiming,
    eventStatus,
    search,
    sortBy,
    sortOrder,
  } = query;

  const skip = (page - 1) * limit;
  const now = new Date();

  // Build where clause for tickets
  const where: any = { ownerId: user.id };
  
  if (status) {
    where.status = status;
  }

  // Build where clause for events
  const eventWhere: any = {};
  
  if (eventStatus) {
    eventWhere.status = eventStatus;
  }

  // Filter by event timing
  if (eventTiming === 'upcoming') {
    eventWhere.startDateTime = { gte: now };
  } else if (eventTiming === 'past') {
    eventWhere.endDateTime = { lt: now };
  } else if (eventTiming === 'today') {
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    
    eventWhere.AND = [
      { startDateTime: { lte: endOfDay } },
      { endDateTime: { gte: startOfDay } }
    ];
  }

  // Search in event title or ticket ID
  if (search) {
    eventWhere.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { id: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Add event filters to ticket where clause
  if (Object.keys(eventWhere).length > 0) {
    where.event = eventWhere;
  }

  // Determine order by clause
  let orderBy: any;
  if (sortBy === 'eventStartDate') {
    orderBy = { event: { startDateTime: sortOrder } };
  } else if (sortBy === 'eventEndDate') {
    orderBy = { event: { endDateTime: sortOrder } };
  } else {
    orderBy = { [sortBy]: sortOrder };
  }

  const [tickets, total] = await Promise.all([
    prismaclient.ticket.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImages: true,
            startDateTime: true,
            endDateTime: true,
            venueName: true,
            venueAddress: true,
            city: true,
            state: true,
            country: true,
            isOnline: true,
            streamingUrl: true,
            status: true,
            timezone: true,
            category: true,
            host: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                organizationName: true,
                profilePictureUrl: true,
              }
            }
          }
        },
        ticketTier: {
          select: {
            id: true,
            name: true,
            priceCents: true,
            currency: true,
            features: true,
          }
        },
        order: {
          select: {
            id: true,
            orderReference: true,
            totalCents: true,
            currency: true,
            createdAt: true,
            paymentStatus: true,
          }
        },
        checkIns: {
          select: {
            id: true,
            checkedInAt: true,
            method: true,
          },
          orderBy: {
            checkedInAt: 'desc'
          },
          take: 1
        }
      }
    }),
    prismaclient.ticket.count({ where }),
  ]);

  // Add computed fields for better UX
  const enrichedTickets = tickets.map(ticket => {
    const event = ticket.event;
    const now = new Date();
    const startDate = new Date(event.startDateTime);
    const endDate = new Date(event.endDateTime);
    
    let eventTimingStatus: 'upcoming' | 'ongoing' | 'past';
    if (now < startDate) {
      eventTimingStatus = 'upcoming';
    } else if (now >= startDate && now <= endDate) {
      eventTimingStatus = 'ongoing';
    } else {
      eventTimingStatus = 'past';
    }

    return {
      ...ticket,
      eventTimingStatus,
      isCheckedIn: ticket.checkIns.length > 0,
      lastCheckIn: ticket.checkIns[0] || null,
      canCheckIn: ticket.status === 'ACTIVE' && 
                  event.status === 'PUBLISHED' && 
                  eventTimingStatus !== 'past',
    };
  });

  res.status(200).send({
    success: true,
    data: enrichedTickets,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

/**
 * Get single ticket details by ticket ID
 */
export const getMyTicketByIdController = async (req: Request, res: Response) => {
  const user = req.user as User;
  const { ticketId } = req.params;

  const ticket = await prismaclient.ticket.findFirst({
    where: {
      OR: [
        { id: ticketId },
        { ticketId: ticketId }
      ],
      ownerId: user.id,
    },
    include: {
      event: {
        include: {
          host: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              organizationName: true,
              profilePictureUrl: true,
              contactEmail: true,
              contactPhone: true,
            }
          }
        }
      },
      ticketTier: true,
      order: {
        select: {
          id: true,
          orderReference: true,
          totalCents: true,
          currency: true,
          createdAt: true,
          paymentStatus: true,
          orderItems: {
            select: {
              quantity: true,
              unitPriceCents: true,
              totalPriceCents: true,
            }
          }
        }
      },
      checkIns: {
        orderBy: {
          checkedInAt: 'desc'
        },
        include: {
          scanner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            }
          }
        }
      }
    }
  });

  if (!ticket) {
    throw new NotFoundError("Ticket not found");
  }

  // Add computed fields
  const now = new Date();
  const startDate = new Date(ticket.event.startDateTime);
  const endDate = new Date(ticket.event.endDateTime);
  
  let eventTimingStatus: 'upcoming' | 'ongoing' | 'past';
  if (now < startDate) {
    eventTimingStatus = 'upcoming';
  } else if (now >= startDate && now <= endDate) {
    eventTimingStatus = 'ongoing';
  } else {
    eventTimingStatus = 'past';
  }

  const enrichedTicket = {
    ...ticket,
    eventTimingStatus,
    isCheckedIn: ticket.checkIns.length > 0,
    canCheckIn: ticket.status === 'ACTIVE' && 
                ticket.event.status === 'PUBLISHED' && 
                eventTimingStatus !== 'past',
    canRefund: ticket.status === 'ACTIVE' && 
               ticket.event.refundableUntil && 
               new Date(ticket.event.refundableUntil) > now,
  };

  res.status(200).send({
    success: true,
    data: enrichedTicket,
  });
};

/**
 * Get ticket statistics/summary for the user
 */
export const getMyTicketStatsController = async (req: Request, res: Response) => {
  const user = req.user as User;
  const now = new Date();

  const [
    totalTickets,
    upcomingTickets,
    pastTickets,
    usedTickets,
    activeTickets,
    totalSpent,
  ] = await Promise.all([
    // Total tickets
    prismaclient.ticket.count({
      where: { ownerId: user.id }
    }),
    
    // Upcoming event tickets
    prismaclient.ticket.count({
      where: {
        ownerId: user.id,
        status: 'ACTIVE',
        event: {
          startDateTime: { gte: now }
        }
      }
    }),
    
    // Past event tickets
    prismaclient.ticket.count({
      where: {
        ownerId: user.id,
        event: {
          endDateTime: { lt: now }
        }
      }
    }),
    
    // Used/checked-in tickets
    prismaclient.ticket.count({
      where: {
        ownerId: user.id,
        status: 'USED'
      }
    }),
    
    // Active tickets
    prismaclient.ticket.count({
      where: {
        ownerId: user.id,
        status: 'ACTIVE'
      }
    }),
    
    // Total money spent (sum of confirmed orders)
    prismaclient.order.aggregate({
      where: {
        userId: user.id,
        status: 'CONFIRMED',
        paymentStatus: 'SUCCEEDED'
      },
      _sum: {
        totalCents: true
      }
    }),
  ]);

  res.status(200).send({
    success: true,
    data: {
      totalTickets,
      upcomingTickets,
      pastTickets,
      usedTickets,
      activeTickets,
      totalSpentCents: totalSpent._sum.totalCents || 0,
    },
  });
};

// ====================== END CONTROLLERS ====================== //