import express from 'express'

import { authMiddleware } from '../middlewares/authMiddleware'
import { getUserProfileController, updateUserProfileController } from '../controller/userController'
import upload from '../services/multer'
import { PROFILE_IMAGE } from '../validator/uploadFields'


export const userRoute = express.Router()


userRoute.get('/profile', authMiddleware,getUserProfileController)
userRoute.put('/profile', authMiddleware, upload.fields(PROFILE_IMAGE) , updateUserProfileController)



