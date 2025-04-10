import express from 'express';
import passport from 'passport';
import { authStrategies } from '../config/passport.js';
import TokenService from '../services/token/jwt_token.js';
import ResponseHandler from '../utils/response.js';

const router = express.Router();

// Log registered strategies
console.log(
  'Registered auth strategies:', 
  authStrategies.map(({ name }) => name)
);

// Define routes and logic together
authStrategies.forEach(({ name }) => {
  
  // Authentication route
  router.get(`/${name}`, (req, res, next) => {
    console.log(`Initiating ${name} authentication...`);
    passport.authenticate(name, { scope: [] })(req, res, next);
  });

  router.get(`/${name}/cbk`, (req, res, next) => {
    passport.authenticate(name, (err, user, info) => {
      console.log('Authentication callback triggered');
      console.log('Error:', err);
      console.log('User:', user); // Log the user object to confirm the accessToken is present
      console.log('Info:', info); // Log the info object for debugging

      if (err) {
        console.error(`${name} authentication error:`, err);
        return ResponseHandler.internalError(res, 'Authentication failed');
      }
      if (!user) {
        console.warn(`${name} authentication failed:`, info);
        return ResponseHandler.unauthorized(res, 'Authentication failed');
      }

      req.logIn(user, (err) => {
        if (err) {
          console.error(`${name} login error:`, err);
          return ResponseHandler.internalError(res, 'Login failed');
        }

        console.log(`${name} user logged in:`, user);

        // Extract the access token from the user object
        const accessToken = user.accessToken;

        if (!accessToken) {
          console.error('Access token is missing in the user object');
          return ResponseHandler.internalError(res, 'Access token is missing');
        }

        // Store the access token in the session
        req.session.accessToken = accessToken;

        // Generate a token for the client
        const token = TokenService.generateToken(user);

        console.log('Server token:', accessToken); // Debugging: Log the generated token

        return ResponseHandler.success(res, 'Authentication successful', {
          token,
          accessToken, // Optionally return the access token to the client
        });
      });
    })(req, res, next);
  });
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout(() => {});
  res.redirect('/');
});

export default router;