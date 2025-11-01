import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from '../config/envConfig';
import { prismaclient } from '../lib/prisma-postgres';


passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.CALLBACK_URL,
    passReqToCallback: true
  },
  async function(accessToken, refreshToken, profile, cb) {
    await prismaclient.user.upsert({
      where: { googleId: profile.id },
      update: { 
        email: profile.emails?.[0]?.value || '',
        firstName: profile.name?.givenName || '',
        lastName: profile.name?.familyName || ''
        },
        create: {
            googleId: profile.id,
            email: profile.emails?.[0]?.value || '',
            firstName: profile.name?.givenName || '',
            lastName: profile.name?.familyName || '',
            phoneNumber:profile.name?.phoneNumber || '',
        }      
    });
    return cb(null, profile);
  }
));


// Serialize user into the sessions
passport.serializeUser((user, done) => {
  done(null, user);
});


//
passport.deserializeUser((user, done) => {
  done(null, user);
});



// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile'] }));

// app.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });