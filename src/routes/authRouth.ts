import express from 'express'
import { changePasswordController, forgotPasswordController, loginController, refreshTokenController, registerController, resetPasswordController} from '../controller/authController'
import { authMiddleware } from '../middlewares/authMiddleware'
import passport from 'passport'

export const authRoute = express()

authRoute.get('/',()=>{
    return "hello"
})

authRoute.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);


authRoute.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['profile', 'email'] })
);
// Handle callback and return JSON tokens
authRoute.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const { user, accessToken, refreshToken } = req.user as any;
    type userDataType = {
      id: string;
      email: string;
        firstName: string;
        lastName: string;
        role: string;
        status: string;
        phoneNumber?: string;
    }
      const { password: _, ...userData }: { password?: string } & userDataType = user;
    return res.status(200).json({
      success: true,
      message: 'Google login successful',
      userData,
      accessToken,
      refreshToken
    });
  }
);





authRoute.post('/login',loginController)
authRoute.post('/signup',registerController)

authRoute.post('/reset-password',resetPasswordController)
authRoute.post('/forgot-password',forgotPasswordController)
authRoute.post('/change-password',authMiddleware,changePasswordController)
authRoute.post('/refresh-token', authMiddleware,refreshTokenController)


