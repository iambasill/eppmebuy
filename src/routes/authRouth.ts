import express from 'express'
import { changePasswordController, forgotPasswordController, loginController, refreshTokenController, registerController, resetPasswordController, verifyResetTokenController} from '../controller/authController'
import { authMiddleware } from '../middlewares/authMiddleware'
import passport from '../config/passportAuth'

export const authRoute = express.Router()

// Test route
authRoute.get('/', (req, res) => {
  return res.json({ message: "Auth service is running" })
})

// Updated Google OAuth with account switching support
authRoute.get(
  '/google',
  (req, res, next) => {
    const state = req.query.state || Date.now().toString();
    
    // Use any to bypass TypeScript issues with passport options
    const authenticate = passport.authenticate('google', {
      scope: ['profile', 'email', 'openid'],
      session: false,
      accessType: 'offline',
      prompt: req.query.prompt || 'select_account',
      state: state
    } as any); // Add 'as any' to fix TypeScript issues
    
    authenticate(req, res, next);
  }
);

// Specific endpoint for switching accounts
authRoute.get('/google/switch', (req, res) => {
  const state = Date.now().toString();
  const redirectUrl = `/auth/google?prompt=select_account&state=${state}`;
  res.redirect(redirectUrl);
});

// Google callback route
authRoute.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { 
      session: false,
      failureRedirect: '/auth/failure'
    } as any)(req, res, next); // Add 'as any' here too
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

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Authentication processing failed'
      });
    }
  }
);

// Facebook OAuth routes
authRoute.get(
  '/facebook',
  (req, res, next) => {
    passport.authenticate('facebook', { 
      scope: ['email', 'public_profile'],
      session: false 
    } as any)(req, res, next);
  }
);

authRoute.get(
  '/facebook/callback',
  (req, res, next) => {
    passport.authenticate('facebook', { 
      session: false,
      failureRedirect: '/auth/failure'
    } as any)(req, res, next);
  },
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
      return res.status(500).json({
        success: false,
        message: 'Facebook authentication processing failed'
      });
    }
  }
);

// Auth failure handler
authRoute.get('/failure', (req, res) => {
  return res.status(401).json({
    success: false,
    message: 'Authentication failed',
    error: req.query.error
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