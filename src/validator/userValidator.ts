import z from "zod"
import { sanitizeObject } from "../utils/zodHandler"


export const updateUserSchema= sanitizeObject(z.object({    
  firstName: z.string().optional(), 
  lastName: z.string().optional(),
    profilePictureUrl: z.string().url().optional(),
    bio: z.string().max(500).optional(),
    gender: z.string().optional(),
    dateOfBirth: z.string().optional(), 
    phoneNumber: z.string().optional(),          
}))

export const updateUserProfileSchema= sanitizeObject(z.object({    
  firstName: z.string().optional(), 
  lastName: z.string().optional(),
    profilePictureUrl: z.string().url().optional(),
    bio: z.string().max(500).optional(),
    gender: z.string().optional(),
    dateOfBirth: z.string().optional(), 
    phoneNumber: z.string().optional(),          
}))


