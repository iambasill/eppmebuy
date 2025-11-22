import { BadRequestError, UnAuthorizedError } from "../logger/exceptions";
import { prismaclient } from "../lib/prisma-postgres";
import express, { Request, Response, NextFunction } from "express";
import { User } from "../../generated/prisma";
import { updateUserProfileSchema } from "../validator/userValidator";


// ====================== CONTROLLERS ====================== //

export const getUserProfileController = async (req:Request,res:Response) => {
 const user = req.user as User

 const profile = await prismaclient.user.findUnique({
  where: {
    id: user.id
  },
    select: {
        email: true,
        firstName: true,
        lastName: true,
        gender: true,
        profilePictureUrl: true,
        dateOfBirth: true,
        bio: true,
        emailVerified: true,
        phoneVerified: true,
        kycStatus: true,
        preferences: true,
        phoneNumber: true,
           _count: {
        select: {
          followers: true,        // Count of followers
          following: true,        // Count of following
          tickets: true,          // Count of tickets
        }
      }
    }

    });
        
    res.status(200).json({
    status: "success",
    data: {
        profile
    }       
 });
}


export const updateUserProfileController = async (req:Request,res:Response) => {
 const user = req.user as User
 const data =  updateUserProfileSchema.parse(req.body);

 const updatedProfile = await prismaclient.user.update({    
    where: {
        id: user.id
    },
    data: {
        ...data
    }
    });
    res.status(200).json({
    status: "success",
    message: "Profile updated successfully"
    });

}  
