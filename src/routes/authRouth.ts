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

// Frontend redirect URLs (configure these based on your environment)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'
const AUTH_SUCCESS_REDIRECT = `${FRONTEND_URL}/auth/success`
const AUTH_FAILURE_REDIRECT = `${FRONTEND_URL}/auth/failure`

// Test route
authRoute.get('/', (req, res) => {
  return res.json({ message: "Auth service is running" })
})

// Google OAuth initiation - with account switching support
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
authRoute.get('/google/switch', (req, res) => {
  const state = Date.now().toString();
  // Redirect to the main Google auth route with select_account prompt
  res.redirect(`/auth/google?prompt=select_account&state=${state}`);
});

// Google callback route
authRoute.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { 
      session: false,
      failureRedirect: '/auth/failure'
    }, (err: any, user: any, info: any) => {
      // Custom callback handler for better error control
      if (err) {
        console.error('Google OAuth Error:', err);
        return res.redirect(`${AUTH_FAILURE_REDIRECT}?error=server_error&message=${encodeURIComponent(err.message)}`);
      }
      
      if (!user) {
        const message = info?.message || 'Authentication failed';
        return res.redirect(`${AUTH_FAILURE_REDIRECT}?error=auth_failed&message=${encodeURIComponent(message)}`);
      }
      
      // Attach user to request for next handler
      req.user = user;
      next();
    })(req, res, next);
  },
  (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(`${AUTH_FAILURE_REDIRECT}?error=no_user_data`);
      }

      const { userData, accessToken, refreshToken } = req.user as any;

      // Encode tokens for URL safety
      const params = new URLSearchParams({
        accessToken: accessToken,
        refreshToken: refreshToken,
        userData: JSON.stringify(userData)
      });

      // Redirect to frontend with tokens
      return res.redirect(`${AUTH_SUCCESS_REDIRECT}?${params.toString()}`);

    } catch (error) {
      console.error('Callback processing error:', error);
      return res.redirect(`${AUTH_FAILURE_REDIRECT}?error=processing_failed`);
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
      session: false,
      failureRedirect: '/auth/failure'
    }, (err: any, user: any, info: any) => {
      if (err) {
        console.error('Facebook OAuth Error:', err);
        return res.redirect(`${AUTH_FAILURE_REDIRECT}?error=server_error&message=${encodeURIComponent(err.message)}`);
      }
      
      if (!user) {
        const message = info?.message || 'Facebook authentication failed';
        return res.redirect(`${AUTH_FAILURE_REDIRECT}?error=auth_failed&message=${encodeURIComponent(message)}`);
      }
      
      req.user = user;
      next();
    })(req, res, next);
  },
  (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(`${AUTH_FAILURE_REDIRECT}?error=no_user_data`);
      }

      const { userData, accessToken, refreshToken } = req.user as any;

      const params = new URLSearchParams({
        accessToken: accessToken,
        refreshToken: refreshToken,
        userData: JSON.stringify(userData)
      });

      return res.redirect(`${AUTH_SUCCESS_REDIRECT}?${params.toString()}`);

    } catch (error) {
      console.error('Facebook callback processing error:', error);
      return res.redirect(`${AUTH_FAILURE_REDIRECT}?error=processing_failed`);
    }
  }
);

// Auth failure handler (can be used as fallback or for API responses)
authRoute.get('/failure', (req, res) => {
  const error = req.query.error || 'unknown_error';
  const message = req.query.message || 'Authentication failed';
  
  // If this is an API call (check Accept header), return JSON
  if (req.headers.accept?.includes('application/json')) {
    return res.status(401).json({
      success: false,
      message: message,
      error: error
    });
  }
  
  // Otherwise redirect to frontend failure page
  return res.redirect(`${AUTH_FAILURE_REDIRECT}?error=${error}&message=${encodeURIComponent(message as string)}`);
});

// Existing auth routes
authRoute.post('/login', loginController)
authRoute.post('/signup', registerController)
authRoute.post('/reset-password', resetPasswordController)
authRoute.post('/verify-otp', verifyResetTokenController)
authRoute.post('/forgot-password', forgotPasswordController)
authRoute.post('/change-password', authMiddleware, changePasswordController)
authRoute.post('/refresh-token', authMiddleware, refreshTokenController)