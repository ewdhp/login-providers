import express from 'express';
import passport from 'passport';
import { authStrategies } from '../config/passport.js';
import TokenService from '../services/token/jwt_token.js'; // Import TokenService

const router = express.Router();

// Log registered strategies
console.log('Registered auth strategies:', authStrategies.map(({ name }) => name));

// Define routes and logic together
authStrategies.forEach(({ name }) => {
  // Authentication route
  router.get(`/${name}`, (req, res, next) => {
    console.log(`Initiating ${name} authentication...`);
    passport.authenticate(name, { scope: [] })(req, res, next);
  });

  // Callback route
  router.get(`/${name}/cbk`, (req, res, next) => {
   

    passport.authenticate(name, (err, user, info) => {
      if (err) {
        console.error(`${name} authentication error:`, err);
        return res.status(500).json({
          success: false,
          message: 'Authentication failed',
          error: err,
        });
      }
      if (!user) {
        console.warn(`${name} authentication failed:`, info);
        return res.status(401).json({
          success: false,
          message: 'Authentication failed',
          error: info,
        });
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error(`${name} login error:`, err);
          return res.status(500).json({
            success: false,
            message: 'Login failed',
            error: err,
          });
        }
        console.log(`${name} user logged in:`, user);
        // Use TokenService to generate the token
        const token = TokenService.generateToken(user);
        return res.status(200).json({
          success: true,
          message: 'Authentication successful',
          token,
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