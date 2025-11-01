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
        const user = await prismaclient.user.upsert({
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
      
        // Attach tokens so callback can access them
        return done(null, { user, ...tokens });
    }
  )
);



passport.use(new FacebookStrategy({
    clientID: config.FACEBOOK_APP_ID || '',
    clientSecret: config.FACEBOOK_APP_SECRET || '',
    callbackURL: config.FACEBOOK_CALLBACK_URL || '', // Fixed: Use Facebook callback URL
    profileFields: ['id',  'name', 'displayName'], // Required for Facebook
    passReqToCallback: true,
  },
  async (req, accessToken, refreshToken, profile, done) => {
      const user = await prismaclient.user.upsert({
        where: { facebookId: profile.id }, // Fixed: Use facebookId instead of googleId
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


        // Attach tokens so callback can access them
        return done(null, { user, ...tokens });
  }
));

passport.serializeUser((data: any, done: (err: any, id?: any) => void) => done(null, data as any));
passport.deserializeUser((data: any, done: (err: any, user?: any) => void) => done(null, data as any));

export default passport;
