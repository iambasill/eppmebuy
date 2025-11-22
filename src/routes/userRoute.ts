import express from 'express'

import { authMiddleware } from '../middlewares/authMiddleware'
import { getUserProfileController, updateUserProfileController } from '../controller/userController'


export const userRoute = express.Router()


userRoute.get('/profile', authMiddleware, getUserProfileController)
userRoute.put('/profile', authMiddleware, updateUserProfileController)



