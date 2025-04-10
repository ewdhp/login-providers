import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';

// Load environment variables
dotenv.config();

// Define authentication strategies
const authStrategies = [
  {
    name: 'facebook',
    Strategy: FacebookStrategy,
    options: {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'email', 'name', 'picture.width(400)'],
    },
  },
];

// Initialize each strategy with its options
authStrategies.forEach(({ name, Strategy, options }) => {
  passport.use(
    name,
    new Strategy(options, (accessToken, refreshToken, profile, done) => {
      console.log('Facebook accessToken:', accessToken); // Debugging: Log the access token
      console.log('Facebook profile:', profile); // Debugging: Log the profile

      // Pass the accessToken and profile to the next middleware
      return done(null, { ...profile, accessToken });
    })
  );
});

// Serialize user into the session
passport.serializeUser((user, done) => {
  // Store only the user ID in the session
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser((id, done) => {
  // Retrieve the user object based on the ID
  // In a real application, you would fetch the user from the database
  done(null, { id });
});

export { authStrategies };