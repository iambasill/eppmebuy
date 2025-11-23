import { BadRequestError, UnAuthorizedError } from "../logger/exceptions";
import { prismaclient } from "../lib/prisma-postgres";
import express, { Request, Response, NextFunction } from "express";
import { User } from "../../generated/prisma";
import { updateUserProfileSchema } from "../validator/userValidator";
import { getFileUrls } from "../utils/fileHandler";


// ====================== CONTROLLERS ====================== //

export const getUserProfileController = async (req:Request,res:Response) => {
 const user = req.user as User

 let profile = await prismaclient.user.findUnique({
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

    if (!profile) throw new BadRequestError('User profile not found');
    
    const preferences = profile?.preferences as { genres?: string[] } | undefined;
    const genres = preferences?.genres ?? [];
    
    profile = {
        ...profile,
        preferences: {
            genres: genres
        }
    };
    res.status(200).json({
    status: "success",
    data: {
        profile
    }       
 });
}


export const updateUserProfileController = async (req:Request,res:Response) => {
 const user = req.user as User
  const files = req.files as Express.Multer.File[];
  let profileImage: string[] = [];
  if (files)  profileImage = getFileUrls(files);



 const data =  updateUserProfileSchema.parse(req.body);

  await prismaclient.user.update({    
    where: {
        id: user.id
    },
    data: {
        ...data,
        profilePictureUrl: profileImage[0] || user.profilePictureUrl
    }
    });
    res.status(200).json({
    status: "success",
    message: "Profile updated successfully"
    });

}  
