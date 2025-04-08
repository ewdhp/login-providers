import express from 'express';
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

export default router;