import express from 'express'
import { changePasswordController, forgotPasswordController, loginController, refreshTokenController, registerController, resetPasswordController} from '../controller/authController'
import { authMiddleware } from '../middlewares/authMiddleware'

export const authRoute = express()

authRoute.get('/',()=>{
    return "hello"
})
authRoute.post('/login',loginController)
authRoute.post('/signup',registerController)

authRoute.post('/reset-password',resetPasswordController)
authRoute.post('/forgot-password',forgotPasswordController)
authRoute.post('/change-password',authMiddleware,changePasswordController)
authRoute.post('/refresh-token',refreshTokenController)

