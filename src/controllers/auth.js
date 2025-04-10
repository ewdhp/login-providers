import express from 'express';
import passport from 'passport';
import { authStrategies } from '../config/passport.js';
import TokenService from '../services/token.js';
import ResponseHandler from '../utils/response.js';

const router = express.Router();

// Log registered strategies
console.log(
  'Registered auth strategies:', 
  authStrategies.map(({ name }) => name)
);

// Define routes and logic together
authStrategies.forEach(({ name }) => {  
  router.get(`/${name}`, (req, res, next) => {
    passport.authenticate
    (name, { scope: [] })(req, res, next);});
  router.get(`/${name}/cbk`, (req, res, next) => {
    passport.authenticate(name, (err, user, info) => {
      if (err) return ResponseHandler.internalError
        (res, 'Authentication failed');
      if (!user) return ResponseHandler.unauthorized
        (res, 'Authentication failed');
      req.logIn(user, (err) => {
        if (err) return ResponseHandler
          .internalError(res, 'Login failed');
        const accessToken = user.accessToken;
        if (!accessToken) return ResponseHandler
          .internalError(res, 'Access token is missing');
        req.session.accessToken = accessToken;
        const token = TokenService.generateToken(user);
        return ResponseHandler.success(
          res, 'Authentication successful', {
          token,accessToken, 
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