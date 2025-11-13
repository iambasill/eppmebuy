// // Facebook OAuth routes
// authRoute.get(
//   '/facebook',
//   (req, res, next) => {
//     const state = req.query.state as string || Date.now().toString();
    
//     passport.authenticate('facebook', { 
//       scope: ['email', 'public_profile'],
//       session: false,
//       state: state
//     })(req, res, next);
//   }
// );

// authRoute.get(
//   '/facebook/callback',
//   (req, res, next) => {
//     passport.authenticate('facebook', { 
//       session: false
//     }, (err: any, user: any, info: any) => {
//       if (err) {
//         console.error('Facebook OAuth Error:', err);
//         return res.status(500).json({
//           success: false,
//           message: 'Facebook authentication server error',
//           error: err.message || 'Internal server error'
//         });
//       }
      
//       if (!user) {
//         const message = info?.message || 'Facebook authentication failed';
//         return res.status(401).json({
//           success: false,
//           message: message,
//           error: 'authentication_failed'
//         });
//       }
      
//       req.user = user;
//       next();
//     })(req, res, next);
//   },
//   (req, res) => {
//     try {
//       if (!req.user) {
//         return res.status(401).json({
//           success: false,
//           message: 'Facebook authentication failed - no user data'
//         });
//       }

//       const { userData, accessToken } = req.user as any;

//       return res.status(200).json({
//         success: true,
//         message: 'Facebook login successful',
//         userData,
//         accessToken,
//       });

//     } catch (error: any) {
//       console.error('Facebook callback processing error:', error);
//       return res.status(500).json({
//         success: false,
//         message: 'Facebook authentication processing failed',
//         error: error.message
//       });
//     }
//   }
// );
