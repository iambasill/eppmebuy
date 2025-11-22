import z from "zod"
import { sanitizeObject } from "../utils/zodHandler"



export const signupSchema= sanitizeObject(z.object({
  firstName: z.string(), 
  lastName: z.string(),             
  email: z.string(),                 
  phoneNumber: z.string(),           
  password: z.string(),              
  role: z.string().optional()           
}))



export const loginSchema= sanitizeObject(z.object({    
  email: z.string(),                 
  password: z.string().min(4),              
}))


export const resetPasswordSchema= sanitizeObject(z.object({    
  newPassword: z.string().optional(), 
  email: z.string().optional(),
  phoneNumber: z.string().optional(),    
  otp: z.string().optional(),         
}))

export const verifyOtpSchema= sanitizeObject(z.object({
  otp: z.string(),
}))



export const forgotPasswordSchema= sanitizeObject(z.object({    
  email: z.string().optional(),
  phoneNumber: z.string().optional(),                 
}))
export const changePasswordSchema= sanitizeObject(z.object({    
  currentPassword: z.string(),                 
  newPassword: z.string(),              
}))


export const supportSchema= sanitizeObject(z.object({    
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  
  email: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 100 characters')
    .toLowerCase()
    .trim(),
  
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must not exceed 5000 characters')
    .trim(),        
}))
