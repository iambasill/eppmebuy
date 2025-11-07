import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './envConfig';
import { prismaclient } from '../lib/prisma-postgres';
import { createUserSession, generateAuthToken } from '../utils/func';
import { Strategy as FacebookStrategy } from 'passport-facebook';
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },

    
    async (req, accessToken, refreshToken, profile, done) => {
        // Create or update user
        let user = await prismaclient.user.upsert({
          where: { googleId: profile.id },
          update: {
            email: profile.emails?.[0]?.value || '',
            firstName: profile.name?.givenName || '',
            lastName: profile.name?.familyName || '',
          },
          create: {
            googleId: profile.id,
            email: profile.emails?.[0]?.value || '',
            firstName: profile.name?.givenName || '',
            lastName: profile.name?.familyName || '',
            status: 'ACTIVE',
            emailVerified: true,
          },
            select: { 
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            role: true,
            status: true
           },
        });

        // Generate tokens
        const tokens = await generateAuthToken(user.id);
        await createUserSession(user.id, tokens.refreshToken, req);
      
        const {id, ...userData} = user
        // Attach tokens so callback can access them
        return done(null, { userData, ...tokens });
    }
  )
);



passport.use(new FacebookStrategy({
    clientID: config.FACEBOOK_APP_ID || '',
    clientSecret: config.FACEBOOK_APP_SECRET || '',
    callbackURL: config.FACEBOOK_CALLBACK_URL || '', // Fixed
    passReqToCallback: true,
    profileFields: ['id', 'emails', 'name', 'displayName'], // Add required profile fields
    scope: ['email', 'public_profile'] // Correct Facebook scopes
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      // Fixed: Use facebookId instead of googleId
      let user = await prismaclient.user.upsert({
        where: { facebookId: profile.id },
        update: {
          email: profile.emails?.[0]?.value || '',
          firstName: profile.name?.givenName || '',
          lastName: profile.name?.familyName || '',
        },
        create: {
          facebookId: profile.id,
          email: profile.emails?.[0]?.value || '',
          firstName: profile.name?.givenName || '',
          lastName: profile.name?.familyName || '',
          status: 'ACTIVE',
        },
        select: { 
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          role: true,
          status: true
        },
      });

      // Generate tokens
      const tokens = await generateAuthToken(user.id);
      await createUserSession(user.id, tokens.refreshToken, req);
      const {id , ...userData} = user

      // Attach tokens so callback can access them
      return done(null, { userData, ...tokens });
    } catch (error) {
      return done(error, null);
    }
  }
));


passport.serializeUser((data: any, done: (err: any, id?: any) => void) => done(null, data as any));
passport.deserializeUser((data: any, done: (err: any, user?: any) => void) => done(null, data as any));

export default passport;
