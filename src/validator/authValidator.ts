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

export const refreshTokenSchema= sanitizeObject(z.object({    
  refreshToken: z.string().optional(),                 
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


