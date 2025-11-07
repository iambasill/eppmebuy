import express , {Request, Response, NextFunction} from 'express'
import { changePasswordController, forgotPasswordController, loginController, refreshTokenController, registerController, resetPasswordController, verifyResetTokenController} from '../controller/authController'
import { authMiddleware } from '../middlewares/authMiddleware'
import passport from '../config/passportAuth'

export const authRoute = express.Router() // Use Router() instead of express()

authRoute.get('/', (req:Request, res:Response) => {
  return res.json({ message: "hello" })
})

// Google OAuth
authRoute.get(
  '/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

// Facebook OAuth  
authRoute.get(
  '/facebook',
  passport.authenticate('facebook', { 
    scope: ['email', 'public_profile'],
    session: false 
  })
);

// Fixed Google Callback with proper error handling
authRoute.get(
  '/google/callback',
  (req, res, next) => {
    console.log('🔄 Google callback initiated:', {
      code: req.query.code ? 'present' : 'missing',
      error: req.query.error,
      userAgent: req.headers['user-agent']
    });
    next();
  },
  passport.authenticate('google', { 
    session: false,
    failureRedirect: '/auth/failure' // Add failure redirect
  }),
  (req, res) => {
    try {
      if (!req.user) {
        console.error('❌ No user data in request');
        return res.status(401).json({
          success: false,
          message: 'Authentication failed - no user data'
        });
      }

      const { userData, accessToken, refreshToken } = req.user as any;
      
      console.log('✅ Google auth successful for:', userData.email);

      // Return JSON response
      return res.status(200).json({
        success: true,
        message: 'Google login successful',
        userData,
        accessToken,
        refreshToken
      });

    } catch (error) {
      console.error('❌ Callback handler error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authentication processing failed'
      });
    }
  }
);

// Facebook Callback (apply same pattern)
authRoute.get(
  '/facebook/callback',
  passport.authenticate('facebook', { 
    session: false,
    failureRedirect: '/auth/failure'
  }),
  (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Facebook authentication failed'
        });
      }

      const { userData, accessToken, refreshToken } = req.user as any;
      
      return res.status(200).json({
        success: true,
        message: 'Facebook login successful',
        userData,
        accessToken,
        refreshToken
      });

    } catch (error) {
      console.error('Facebook callback error:', error);
      return res.status(500).json({
        success: false,
        message: 'Facebook authentication processing failed'
      });
    }
  }
);

// Add failure route for handling errors
authRoute.get('/failure', (req, res) => {
  console.error('Auth failure:', req.query);
  return res.status(401).json({
    success: false,
    message: 'Authentication failed',
    error: req.query.error
  });
});

// Your existing routes
authRoute.post('/login', loginController)
authRoute.post('/signup', registerController)
authRoute.post('/reset-password', resetPasswordController)
authRoute.post('/verify-otp', verifyResetTokenController)
authRoute.post('/forgot-password', forgotPasswordController)
authRoute.post('/change-password', authMiddleware, changePasswordController)
authRoute.post('/refresh-token', authMiddleware, refreshTokenController)