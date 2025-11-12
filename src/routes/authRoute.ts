import express from 'express'
import { 
  changePasswordController, 
  forgotPasswordController, 
  loginController,  
  registerController, 
  resetPasswordController, 
  verifyResetTokenController
} from '../controller/authController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { googleRoute } from './googleRoute'

export const authRoute = express.Router()

authRoute.use('/google', googleRoute)

authRoute.post('/login', loginController)
authRoute.post('/signup', registerController)
authRoute.post('/reset-password', resetPasswordController)
authRoute.post('/verify-otp', verifyResetTokenController)
authRoute.post('/forgot-password', forgotPasswordController)
authRoute.post('/change-password', authMiddleware, changePasswordController)

// Auth failure handler
authRoute.get('/failure', (req, res) => {
  const error = req.query.error || 'unknown_error';
  const message = req.query.message || 'Authentication failed';
  
  return res.status(401).json({
    success: false,
    message: message,
    error: error
  });
});