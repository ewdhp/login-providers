import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
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
      console.log('Facebook accessToken:', accessToken); 
      console.log('Facebook profile:', profile);
      return done(null, { ...profile, accessToken });
    })
  );
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, { id });
});

export { authStrategies };