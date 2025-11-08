import express, { Request, Response, NextFunction } from "express";
import { BadRequestError, UnAuthorizedError, NotFoundError } from "../logger/exceptions";
import { 
  createEventSchema, 
  updateEventSchema, 
  getEventsQuerySchema 
} from "../validator/eventValidator";
import { prismaclient } from "../lib/prisma-postgres";
import { User } from "../../generated/prisma";
import slugify from "slugify";
import { getFileUrls } from "../utils/fileHandler";

// ====================== CONTROLLERS ====================== //

/**
 * Create a new event (HOST only).
 */
export const createEventController = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;
  
  // Check if user is a HOST
  if (user.role !== "HOST") {
    throw new UnAuthorizedError("Only hosts can create events");
  }

  // Get uploaded files from multer
  const files = req.files as Express.Multer.File[];
  
//   if (!files || files.length === 0) {
//     throw new BadRequestError("At least one cover image is required");
//   }

const coverImages = getFileUrls(files);



  // Merge coverImages with request body
  const validatedData = createEventSchema.parse({
    ...req.body,
    coverImages,
    // Parse JSON fields if sent as strings from FormData
    tags: req.body.tags ? JSON.parse(req.body.tags) : [],
  });
  
  // Generate slug from title
  const slug = slugify(validatedData.title, { lower: true, strict: true }) + "-" + Date.now();
  
  // Validate dates
  const startDate = new Date(validatedData.startDateTime);
  const endDate = new Date(validatedData.endDateTime);
  
  if (endDate <= startDate) {
    throw new BadRequestError("End date must be after start date");
  }

  const event = await prismaclient.event.create({
    data: {
      ...validatedData,
      slug,
      hostId: user.id,
      startDateTime: startDate,
      endDateTime: endDate,
      checkInWindowStart: validatedData.checkInWindowStart ? new Date(validatedData.checkInWindowStart) : null,
      checkInWindowEnd: validatedData.checkInWindowEnd ? new Date(validatedData.checkInWindowEnd) : null,
      refundableUntil: validatedData.refundableUntil ? new Date(validatedData.refundableUntil) : null,
      visibilityDate: validatedData.visibilityDate ? new Date(validatedData.visibilityDate) : null,
    },
    include: {
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
  });

  // TODO: Queue job for event created notification
  // await eventQueue.add('event-created', { eventId: event.id });

  res.status(201).send({
    success: true,
    message: "Event created successfully",
    data: event,
  });
};

/**
 * Get all events with filters and pagination.
 */
export const getEventsController = async (req: Request, res: Response) => {
  const query = getEventsQuerySchema.parse(req.query);
  
  const {
    page,
    limit,
    category,
    status,
    accessType,
    city,
    country,
    isFeatured,
    isOnline,
    startDateFrom,
    startDateTo,
    search,
    sortBy,
    sortOrder,
  } = query;

  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};
  
  if (category) where.category = category;
  if (status) where.status = status;
  if (accessType) where.accessType = accessType;
  if (city) where.city = city;
  if (country) where.country = country;
  if (isFeatured !== undefined) where.isFeatured = isFeatured;
  if (isOnline !== undefined) where.isOnline = isOnline;
  
  // Date range filter
  if (startDateFrom || startDateTo) {
    where.startDateTime = {};
    if (startDateFrom) where.startDateTime.gte = new Date(startDateFrom);
    if (startDateTo) where.startDateTime.lte = new Date(startDateTo);
  }
  
  // Search in title and description
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags: { has: search } },
    ];
  }

  const [events, total] = await Promise.all([
    prismaclient.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        host: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            organizationName: true,
            profilePictureUrl: true,
          }
        },
        ticketTiers: {
          where: { isVisible: true },
          select: {
            id: true,
            name: true,
            priceCents: true,
            currency: true,
            quantity: true,
            quantitySold: true,
          }
        },
        _count: {
          select: {
            reviews: true,
            favorites: true,
          }
        }
      }
    }),
    prismaclient.event.count({ where }),
  ]);

  res.status(200).send({
    success: true,
    data: events,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

/**
 * Get single event by ID or slug.
 */
export const getEventController = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const event = await prismaclient.event.findFirst({
    where: {
      OR: [
        { id },
        { slug: id },
      ]
    },
    include: {
      host: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          organizationName: true,
          profilePictureUrl: true,
          bio: true,
        }
      },
      ticketTiers: {
        where: { isVisible: true },
        orderBy: { sortOrder: 'asc' }
      },
      addOns: {
        where: { isVisible: true }
      },
      promoCodes: {
        where: { isActive: true },
        select: {
          id: true,
          code: true,
          discountType: true,
          discountValue: true,
          validFrom: true,
          validUntil: true,
        }
      },
      reviews: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
            }
          }
        }
      },
      _count: {
        select: {
          reviews: true,
          favorites: true,
          tickets: true,
        }
      }
    }
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  // Increment view count (can be queued)
  // TODO: Queue job for analytics
  // await analyticsQueue.add('event-view', { eventId: event.id, userId: req.user?.id });
  
  await prismaclient.event.update({
    where: { id: event.id },
    data: { viewCount: { increment: 1 } }
  });

  res.status(200).send({
    success: true,
    data: event,
  });
};

/**
 * Update event (HOST only - own events).
 */
export const updateEventController = async (req: Request, res: Response) => {
  const user = req.user as User;
  const { id } = req.params;
  
  // Get uploaded files from multer (if any)
  const files = req.files as Express.Multer.File[];
  
  let updatePayload: any = { ...req.body };

  // If new images are uploaded, add them to the payload
  if (files && files.length > 0) {
    const newCoverImages = files.map(file => file.path || file.filename);
    updatePayload.coverImages = newCoverImages;
  }

  // Parse JSON fields if sent as strings from FormData
  if (req.body.tags && typeof req.body.tags === 'string') {
    updatePayload.tags = JSON.parse(req.body.tags);
  }

  const validatedData = updateEventSchema.parse(updatePayload);

  // Check if event exists and user is the host
  const existingEvent = await prismaclient.event.findUnique({
    where: { id },
    select: { hostId: true, status: true, startDateTime: true, endDateTime: true }
  });

  if (!existingEvent) {
    throw new NotFoundError("Event not found");
  }

  if (existingEvent.hostId !== user.id) {
    throw new UnAuthorizedError("You can only update your own events");
  }

  // Prevent updating completed or cancelled events
  if (existingEvent.status === "COMPLETED" || existingEvent.status === "CANCELLED") {
    throw new BadRequestError("Cannot update completed or cancelled events");
  }

  // Validate dates if provided
  if (validatedData.startDateTime || validatedData.endDateTime) {
    const startDate = validatedData.startDateTime 
      ? new Date(validatedData.startDateTime) 
      : existingEvent.startDateTime;
    
    const endDate = validatedData.endDateTime 
      ? new Date(validatedData.endDateTime) 
      : existingEvent.endDateTime;

    if (endDate <= startDate) {
      throw new BadRequestError("End date must be after start date");
    }
  }

  const updateData: any = { ...validatedData };
  
  // Convert date strings to Date objects
  if (validatedData.startDateTime) updateData.startDateTime = new Date(validatedData.startDateTime);
  if (validatedData.endDateTime) updateData.endDateTime = new Date(validatedData.endDateTime);
  if (validatedData.checkInWindowStart) updateData.checkInWindowStart = new Date(validatedData.checkInWindowStart);
  if (validatedData.checkInWindowEnd) updateData.checkInWindowEnd = new Date(validatedData.checkInWindowEnd);
  if (validatedData.refundableUntil) updateData.refundableUntil = new Date(validatedData.refundableUntil);
  if (validatedData.visibilityDate) updateData.visibilityDate = new Date(validatedData.visibilityDate);

  const updatedEvent = await prismaclient.event.update({
    where: { id },
    data: updateData,
    include: {
      host: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          organizationName: true,
        }
      }
    }
  });

  // TODO: Queue job for event updated notification
  // await eventQueue.add('event-updated', { eventId: updatedEvent.id });

  res.status(200).send({
    success: true,
    message: "Event updated successfully",
    data: updatedEvent,
  });
};

/**
 * Delete event (HOST only - own events, only drafts).
 */
export const deleteEventController = async (req: Request, res: Response) => {
  const user = req.user as User;
  const { id } = req.params;

  const event = await prismaclient.event.findUnique({
    where: { id },
    select: { hostId: true, status: true, ticketsSold: true, coverImages: true }
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  if (event.hostId !== user.id) {
    throw new UnAuthorizedError("You can only delete your own events");
  }

  // Only allow deletion of draft events with no tickets sold
  if (event.status !== "DRAFT") {
    throw new BadRequestError("Only draft events can be deleted. Cancel published events instead.");
  }

  if (event.ticketsSold > 0) {
    throw new BadRequestError("Cannot delete event with sold tickets");
  }

  await prismaclient.event.delete({
    where: { id }
  });

  // TODO: Queue job to delete cover images from storage
  // await storageQueue.add('delete-images', { images: event.coverImages });

  res.status(200).send({
    success: true,
    message: "Event deleted successfully",
  });
};

/**
 * Cancel event (HOST only - own events).
 */
export const cancelEventController = async (req: Request, res: Response) => {
  const user = req.user as User;
  const { id } = req.params;

  const event = await prismaclient.event.findUnique({
    where: { id },
    select: { hostId: true, status: true }
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  if (event.hostId !== user.id) {
    throw new UnAuthorizedError("You can only cancel your own events");
  }

  if (event.status === "CANCELLED") {
    throw new BadRequestError("Event is already cancelled");
  }

  if (event.status === "COMPLETED") {
    throw new BadRequestError("Cannot cancel completed events");
  }

  await prismaclient.event.update({
    where: { id },
    data: { status: "CANCELLED" }
  });

  // TODO: Queue job for refunds and notifications
  // await eventQueue.add('event-cancelled', { eventId: id });

  res.status(200).send({
    success: true,
    message: "Event cancelled successfully. Refunds will be processed.",
  });
};

/**
 * Publish event (HOST only - change from DRAFT to PUBLISHED).
 */
export const publishEventController = async (req: Request, res: Response) => {
  const user = req.user as User;
  const { id } = req.params;

  const event = await prismaclient.event.findUnique({
    where: { id },
    include: {
      ticketTiers: true
    }
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  if (event.hostId !== user.id) {
    throw new UnAuthorizedError("You can only publish your own events");
  }

  if (event.status !== "DRAFT") {
    throw new BadRequestError("Only draft events can be published");
  }

  // Validate event has at least one ticket tier
  if (event.ticketTiers.length === 0) {
    throw new BadRequestError("Event must have at least one ticket tier before publishing");
  }

  await prismaclient.event.update({
    where: { id },
    data: { 
      status: "PUBLISHED",
      publishedAt: new Date()
    }
  });

  // TODO: Queue job for event published notification and marketing
  // await eventQueue.add('event-published', { eventId: id });

  res.status(200).send({
    success: true,
    message: "Event published successfully",
  });
};

/**
 * Get host's own events.
 */
export const getMyEventsController = async (req: Request, res: Response) => {
  const user = req.user as User;
  const query = getEventsQuerySchema.parse(req.query);
  
  const { page, limit, status, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: any = { hostId: user.id };
  if (status) where.status = status;

  const [events, total] = await Promise.all([
    prismaclient.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        ticketTiers: {
          select: {
            id: true,
            name: true,
            priceCents: true,
            quantitySold: true,
            quantity: true,
          }
        },
        _count: {
          select: {
            orders: true,
            tickets: true,
            reviews: true,
          }
        }
      }
    }),
    prismaclient.event.count({ where }),
  ]);

  res.status(200).send({
    success: true,
    data: events,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

// ====================== END CONTROLLERS ====================== //