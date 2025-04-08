import express from 'express';
import passport from 'passport';
import AuthController from '../controllers/auth.js'; 

const router = express.Router(); 

const authMethods = Object
.keys(AuthController)
.filter(method => method
    .endsWith('Auth'));
    
authMethods.forEach((method) => {
const strategy = method.replace('Auth', '');
router.get(`/${strategy}`, AuthController[method]);
router.get(`/${strategy}/cbk`, AuthController[`${strategy}Cbk`]);
});

// Google with scope
router.get('/google', passport.authenticate
('google', { scope: ['email', 'profile'] } ));
router.get('/google/cbk', AuthController.googleCbk);

// Microsoft with scope
router.get('/mcs', passport.authenticate
('mcs', { scope: ['user.read'] } ));
router.get('/mcs/cbk', AuthController.mcsCbk);

export default router;