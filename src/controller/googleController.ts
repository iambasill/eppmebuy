import { Request, Response, NextFunction } from "express";
import passport from '../config/passportAuth'


// Google OAuth initiation
export const google = (req:Request, res:Response, next:NextFunction) => {
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

// Specific endpoint for switching accounts
export const googleSwitch = (req:Request, res:Response, next:NextFunction) => {
  const state = Date.now().toString();
  
  passport.authenticate('google', {
    scope: ['profile', 'email', 'openid'],
    session: false,
    accessType: 'offline',
    prompt: 'select_account',
    state: state
  })(req, res, next);
};

// Google callback route
export const googleCallback = (req:Request, res:Response, next:NextFunction) => {
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
  }
  (req:Request, res:Response) => {
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



