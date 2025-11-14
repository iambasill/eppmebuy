import { Request, Response, NextFunction } from "express";
import passport from '../config/passportAuth';

// Google OAuth initiation
export const google = (req: Request, res: Response, next: NextFunction) => {
  const redirectUri = req.query.redirectUri as string;
  const prompt = req.query.prompt as string || 'consent';
  
  // Validate that redirectUri is provided
  if (!redirectUri) {
    return res.status(400).json({
      success: false,
      message: 'redirectUri query parameter is required'
    });
  }
  
  passport.authenticate('google', {
    scope: ['profile', 'email', 'openid'],
    session: false,
    accessType: 'offline',
    prompt: prompt,
    state: redirectUri 
  })(req, res, next);
};

// Specific endpoint for switching accounts
export const googleSwitch = (req: Request, res: Response, next: NextFunction) => {
  const redirectUri = req.query.redirectUri as string;
  
  if (!redirectUri) {
    return res.status(400).json({
      success: false,
      message: 'redirectUri query parameter is required'
    });
  }
  
  passport.authenticate('google', {
    scope: ['profile', 'email', 'openid'],
    session: false,
    accessType: 'offline',
    prompt: 'select_account',
    state: redirectUri 
  })(req, res, next);
};

// Google callback route
export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { 
    session: false
  }, (err: any, user: any, info: any) => {
    if (err) {
      console.error('Google OAuth Error:', err);
      
      const redirectUri = req.query.state as string || 'http://localhost:3000';
      
      return res.redirect(`${redirectUri}?error=${encodeURIComponent(err.message || 'authentication_error')}`);
    }
    
    if (!user) {
      const message = info?.message || 'Authentication failed';
      const redirectUri = req.query.state as string || 'http://localhost:3000';
      
      return res.redirect(`${redirectUri}?error=${encodeURIComponent(message)}`);
    }
    
    req.user = user;
    next();
  })(req, res, next);
};

// Process the callback and redirect back to app
export const googleCallbackSuccess = (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const redirectUri = req.query.state as string || 'http://localhost:3000';
      return res.redirect(`${redirectUri}?error=no_user_data`);
    }

    const { userData, accessToken, refreshToken } = req.user as any;
    
    // Validate we have required data
    if (!accessToken || !userData) {
      console.error('Missing required auth data:', { accessToken: !!accessToken, userData: !!userData });
      const redirectUri = req.query.state as string || 'http://localhost:3000';
      return res.redirect(`${redirectUri}?error=missing_auth_data`);
    }
    
    // Get the redirectUri from the state parameter
    const redirectUri = req.query.state as string || 'http://localhost:3000';

    // Build the redirect URL with tokens as query parameters
    const params = new URLSearchParams({
      accessToken: accessToken,
      userId: userData?.id || '',
      email: userData?.email || '',
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      role: userData?.role || 'USER'
    });

    // Add refreshToken only if it exists
    if (refreshToken) {
      params.append('refreshToken', refreshToken);
    }

    const redirectUrl = `${redirectUri}?${params.toString()}`;

    console.log('Redirecting to:', redirectUrl); // Debug log

    return res.redirect(redirectUrl);

  } catch (error: any) {
    console.error('Callback processing error:', error);
    const redirectUri = req.query.state as string || 'http://localhost:3000';
    return res.redirect(`${redirectUri}?error=${encodeURIComponent(error.message || 'processing_error')}`);
  }
};