import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './envConfig';
import { prismaclient } from '../lib/prisma-postgres';
import { createUserSession, generateAuthToken } from '../utils/func';

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
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
        });

        // Generate tokens
        const tokens = await generateAuthToken(user.id);
        await createUserSession(user.id, tokens.refreshToken, req);

        // Attach tokens so callback can access them
        return done(null, { user, ...tokens });
      } catch (err) {
        console.error(err);
        done(err as Error);
      }
    }
  )
);

passport.serializeUser((data: any, done: (err: any, id?: any) => void) => done(null, data as any));
passport.deserializeUser((data: any, done: (err: any, user?: any) => void) => done(null, data as any));

export default passport;
