import express from 'express';
import passport from 'passport';
import AuthController from '../controllers/auth.js'; 


const router = express.Router(); 

// Extract strategy names from AuthController
const authMethods = Object.keys(AuthController).filter(
  method => method.endsWith('Auth')
);

authMethods.forEach((method) => {

  // Extract the strategy name
  const strategy = method.replace('Auth', '');
  
  // Define the authentication route 
  router.get(
    `/${strategy}`, 
    AuthController[method]
  );

  // Define the callback route
  router.get(
    `/${strategy}/callback`, 
    AuthController[`${strategy}Callback`]
  );
});

// Specific routes for Google with scope
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] } ));
router.get('/google/callback', AuthController.googleCallback);

// Specific routes for Microsoft with scope
router.get('/microsoft', passport.authenticate('microsoft', { scope: ['user.read'] } ));
router.get('/microsoft/callback', AuthController.microsoftCallback);

export default router;