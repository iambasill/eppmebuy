import z from "zod"
import { sanitizeObject } from "../utils/zodHandler"

// Enums
export const eventStatusEnum = z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"])
export const eventAccessTypeEnum = z.enum(["PUBLIC", "INVITE_ONLY", "PRIVATE"])
export const eventCategoryEnum = z.enum([
  "MUSIC", "SPORTS", "ARTS", "TECHNOLOGY", "BUSINESS", 
  "FOOD", "EDUCATION", "ENTERTAINMENT", "HEALTH", "NIGHTLIFE", "OTHER"
])
export const checkInMethodEnum = z.enum(["QR_SCAN", "MANUAL", "KIOSK"])
export const qrScanModeEnum = z.enum(["SINGLE_USE", "MULTI_USE"])

// Create Event Schema
export const createEventSchema = sanitizeObject(z.object({
  // Basic Info
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  coverImages: z.array(z.string()).min(1, "At least one cover image is required"),
  category: eventCategoryEnum,
  
  // Timing
  startDateTime: z.string().datetime(),
  endDateTime: z.string().datetime(),
  timezone: z.string().default("UTC"),
  
  // Location
  isOnline: z.string().default("false"),
  streamingUrl: z.string().url().optional(),
  venueName: z.string().min(1, "Venue name is required"),
  venueAddress: z.string().min(1, "Venue address is required"),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default("Nigeria"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  
  // Capacity & Access
  totalCapacity: z.string().optional(),
  accessType: eventAccessTypeEnum.default("INVITE_ONLY"),
  ageRestriction: z.string().optional(),
  
  // Pricing & Fees
  vipFee: z.string().min(0).max(100).optional(),
  economyFee: z.string().min(0).optional(),
  
  // Ticketing Settings
  ticketLimitPerOrder: z.string().default("10"),
  
  // Check-in Settings
  checkInMethod: checkInMethodEnum.default("QR_SCAN"),
  qrScanMode: qrScanModeEnum.default("SINGLE_USE"),
  checkInWindowStart: z.string().datetime().optional(),
  checkInWindowEnd: z.string().datetime().optional(),
  
  // Refund Policy
  refundPolicy: z.string().optional(),
  refundableUntil: z.string().datetime().optional(),
  
  // Publication
  status: eventStatusEnum.default("DRAFT"),
  visibilityDate: z.string().datetime().optional(),
  isFeatured: z.boolean().default(false),
}))

// Update Event Schema (all fields optional except what shouldn't change)
export const updateEventSchema = sanitizeObject(z.object({
  // Basic Info
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  coverImages: z.array(z.string()).min(1).optional(),
  category: eventCategoryEnum.optional(),
  
  // Timing
  startDateTime: z.string().datetime().optional(),
  endDateTime: z.string().datetime().optional(),
  timezone: z.string().optional(),
  
  // Location
  isOnline: z.string().optional(),
  streamingUrl: z.string().url().optional(),
  venueName: z.string().min(1).optional(),
  venueAddress: z.string().min(1).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().min(1).optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  
  // Capacity & Access
  totalCapacity: z.string().optional(),
  accessType: eventAccessTypeEnum.optional(),
  ageRestriction: z.string().optional(),
  
  // Pricing & Fees
  vipFee: z.string().min(0).optional(),
  economyFee: z.string().min(0).optional(),
  
  // Ticketing Settings
  ticketLimitPerOrder: z.number().int().positive().optional(),
  
  // Check-in Settings
  checkInMethod: checkInMethodEnum.optional(),
  qrScanMode: qrScanModeEnum.optional(),
  checkInWindowStart: z.string().datetime().optional(),
  checkInWindowEnd: z.string().datetime().optional(),
  
  // Refund Policy
  refundPolicy: z.string().optional(),
  refundableUntil: z.string().datetime().optional(),
  
  // Publication
  status: eventStatusEnum.optional(),
  visibilityDate: z.string().datetime().optional(),
  isFeatured: z.boolean().optional(),
}))

// Query/Filter Schema for GET requests
export const getEventsQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).default(1),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).default(20),
  
  // Filters
  category: eventCategoryEnum.optional(),
  status: eventStatusEnum.optional(),
  accessType: eventAccessTypeEnum.optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  isFeatured: z.string().transform(val => val === "true").optional(),
  isOnline: z.string().transform(val => val === "true").optional(),
  
  // Date filters
  startDateFrom: z.string().datetime().optional(),
  startDateTo: z.string().datetime().optional(),
  
  // Search
  search: z.string().optional(),
  
  // Sorting
  sortBy: z.enum(["startDateTime", "createdAt", "viewCount", "ticketsSold", "averageRating"]).default("startDateTime"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
})

// Type exports
export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
export type GetEventsQuery = z.infer<typeof getEventsQuerySchema>