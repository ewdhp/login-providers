import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define authentication strategies
const authStrategies = [
  {
    name: 'twitter',
    Strategy: TwitterStrategy,
    options: {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
      includeEmail: true
    }
  },
  {
    name: 'discord',
    Strategy: DiscordStrategy,
    options: {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CALLBACK_URL,
      scope: ['identify', 'email']
    }
  },
  {
    name: 'facebook',
    Strategy: FacebookStrategy,
    options: {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'email', 'name', 'picture.width(400)']
    }
  },
  {
    name: 'instagram',
    Strategy: FacebookStrategy,
    options: {
      clientID: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      callbackURL: process.env.INSTAGRAM_CALLBACK_URL,
      profileFields: ['id', 'email', 'name', 'picture.width(400)']
    }
  },
  {
    name: 'google',
    Strategy: GoogleStrategy,
    options: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email']
    }
  },
  {
    name: 'microsoft',
    Strategy: MicrosoftStrategy,
    options: {
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: process.env.MICROSOFT_CALLBACK_URL,
      scope: ['user.read']
    }
  }
];

// Initialize each strategy with its options
authStrategies.forEach(({ name, Strategy, options }) => {
  passport.use(name, new Strategy (options,
    (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }));
});

// Serialize user information into the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user information from the session
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Export the authentication strategies
export { authStrategies };