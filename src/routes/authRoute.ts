import express from 'express'
import { 
  changePasswordController, 
  forgotPasswordController, 
  loginController, 
  refreshTokenController, 
  registerController, 
  resetPasswordController, 
  verifyResetTokenController
} from '../controller/authController'
import { authMiddleware } from '../middlewares/authMiddleware'
import passport from '../config/passportAuth'

export const authRoute = express.Router()

// Test route
authRoute.get('/', (req, res) => {
  return res.json({ message: "Auth service is running" })
})

// Google OAuth initiation
authRoute.get(
  '/google',
  (req, res, next) => {
    const state = req.query.state as string || Date.now().toString();
    const prompt = req.query.prompt as string || 'consent';
    
    passport.authenticate('google', {
      scope: ['profile', 'email', 'openid'],
      session: false,
      accessType: 'offline',
      prompt: prompt,
      state: state
    })(req, res, next);
  }
);

// Specific endpoint for switching accounts
authRoute.get('/google/switch', (req, res, next) => {
  const state = Date.now().toString();
  
  passport.authenticate('google', {
    scope: ['profile', 'email', 'openid'],
    session: false,
    accessType: 'offline',
    prompt: 'select_account',
    state: state
  })(req, res, next);
});

// Google callback route
authRoute.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { 
      session: false
    }, (err: any, user: any, info: any) => {
      if (err) {
        console.error('Google OAuth Error:', err);
        return res.status(500).json({
          success: false,
          message: 'Authentication server error',
          error: err.message || 'Internal server error'
        });
      }
      
      if (!user) {
        const message = info?.message || 'Authentication failed';
        return res.status(401).json({
          success: false,
          message: message,
          error: 'authentication_failed'
        });
      }
      
      req.user = user;
      next();
    })(req, res, next);
  },
  (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication failed - no user data'
        });
      }

      const { userData, accessToken, refreshToken } = req.user as any;

      return res.status(200).json({
        success: true,
        message: 'Google login successful',
        userData,
        accessToken,
        refreshToken
      });

    } catch (error: any) {
      console.error('Callback processing error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authentication processing failed',
        error: error.message
      });
    }
  }
);

// Facebook OAuth routes
authRoute.get(
  '/facebook',
  (req, res, next) => {
    const state = req.query.state as string || Date.now().toString();
    
    passport.authenticate('facebook', { 
      scope: ['email', 'public_profile'],
      session: false,
      state: state
    })(req, res, next);
  }
);

authRoute.get(
  '/facebook/callback',
  (req, res, next) => {
    passport.authenticate('facebook', { 
      session: false
    }, (err: any, user: any, info: any) => {
      if (err) {
        console.error('Facebook OAuth Error:', err);
        return res.status(500).json({
          success: false,
          message: 'Facebook authentication server error',
          error: err.message || 'Internal server error'
        });
      }
      
      if (!user) {
        const message = info?.message || 'Facebook authentication failed';
        return res.status(401).json({
          success: false,
          message: message,
          error: 'authentication_failed'
        });
      }
      
      req.user = user;
      next();
    })(req, res, next);
  },
  (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Facebook authentication failed - no user data'
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

    } catch (error: any) {
      console.error('Facebook callback processing error:', error);
      return res.status(500).json({
        success: false,
        message: 'Facebook authentication processing failed',
        error: error.message
      });
    }
  }
);

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

// Existing auth routes
authRoute.post('/login', loginController)
authRoute.post('/signup', registerController)
authRoute.post('/reset-password', resetPasswordController)
authRoute.post('/verify-otp', verifyResetTokenController)
authRoute.post('/forgot-password', forgotPasswordController)
authRoute.post('/change-password', authMiddleware, changePasswordController)
authRoute.post('/refresh-token', authMiddleware, refreshTokenController)