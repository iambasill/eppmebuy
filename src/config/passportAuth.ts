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
    const profileId = profile.id;
    const email = profile.emails?.[0]?.value;
    
    // First, try to find user by googleId OR email
    let user = await prismaclient.user.findFirst({
      where: {
        OR: [
          { googleId: profileId },
          { email: email }
        ]
      },
      select: { 
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            role: true,
            status: true,
            googleId: true

      },
    });

    if (user && !user.googleId) {
      // Update existing user with Google info if needed
    
        user = await prismaclient.user.update({
          where: { id: user.id },
          data: {
            googleId: profileId,
            emailVerified: true,

          },
          select: { 
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            role: true,
            status: true,
            googleId: true
          },
        });
    } else if (!user) {
      // Create new user
      user = await prismaclient.user.create({
        data: {
          googleId: profileId,
          email: email,
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
          status: true,
          googleId:true
        },
      });
    }

    // Generate tokens
    const tokens = await generateAuthToken(user.id);
    await createUserSession(user.id, tokens.refreshToken, req);
  
    const {id,googleId, ...userData} = user;
    return done(null, { userData, ...tokens });
}
  )
);



// passport.use(new FacebookStrategy({
//     clientID: config.FACEBOOK_APP_ID || '',
//     clientSecret: config.FACEBOOK_APP_SECRET || '',
//     callbackURL: config.FACEBOOK_CALLBACK_URL || '',
//     passReqToCallback: true,
//     profileFields: ['id', 'emails', 'name', 'displayName'],
//     scope: ['email', 'public_profile']
//   },

//   async (req, accessToken, refreshToken, profile, done) => {
//     const profileId = profile.id;
//     const email = profile.emails?.[0]?.value ;
    
//     // First, try to find user by facebookId OR email
//     let user = await prismaclient.user.findFirst({
//       where: {
//         OR: [
//           { facebookId: profileId },
//           { email: email }
//         ]
//       },
//       select: { 
//         id: true,
//         firstName: true,
//         lastName: true,
//         email: true,
//         phoneNumber: true,
//         role: true,
//         status: true,
//         facebookId: true
//       },
//     });

//     if (user) {
//       // Update existing user with Facebook info if needed
//       if (!user.facebookId) {
//         user = await prismaclient.user.update({
//           where: { id: user.id },
//           data: {
//             facebookId: profileId,  // ✅ FIXED: Now using facebookId
//             emailVerified: true,
//             firstName: user.firstName || profile.name?.givenName || '',
//             lastName: user.lastName || profile.name?.familyName || '',
//           },
//           select: { 
//             id: true,
//             firstName: true,
//             lastName: true,
//             email: true,
//             phoneNumber: true,
//             role: true,
//             status: true,
//             facebookId: true
//           },
//         });
//       }
//       // ✅ FIXED: If user already has facebookId, we just use existing user
//     } else {
//       // Create new user
//       user = await prismaclient.user.create({
//         data: {
//           facebookId: profileId,  
//           email: email,
//           firstName: profile.name?.givenName || '',
//           lastName: profile.name?.familyName || '',
//           status: 'ACTIVE',
//           emailVerified: true,
//         },
//         select: { 
//           id: true,
//           firstName: true,
//           lastName: true,
//           email: true,
//           phoneNumber: true,
//           role: true,
//           status: true,
//           facebookId: true
//         },
//       });
//     }

//     // Generate tokens
//     const tokens = await generateAuthToken(user.id);
//     await createUserSession(user.id, tokens.refreshToken, req);
  
//     const {id, facebookId, ...userData} = user;
//     return done(null, { userData, ...tokens });
// }
// ));

passport.serializeUser((data: any, done: (err: any, id?: any) => void) => done(null, data as any));
passport.deserializeUser((data: any, done: (err: any, user?: any) => void) => done(null, data as any));

export default passport;
