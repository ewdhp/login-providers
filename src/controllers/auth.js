import passport from 'passport';
import { authStrategies } from '../config/passport.js';
import TokenService from '../services/token/jwt_token.js'; // Import TokenService

const AuthController = {};

authStrategies.forEach(({ name }) => {  
  AuthController[`${name}Auth`] = passport
    .authenticate( name, { scope: [] });
  AuthController[`${name}Cbk`] = (req, res, next) => {
    passport.authenticate(name, (err, user, info) => {
      
      if (err) {
        return res.status(500)
        .json({ 
          success: false, 
          message: 'Authentication failed', 
          error: err 
        });
      }
      if (!user) {
        return res.status(401)
        .json({ 
          success: false, 
          message: 'Authentication failed', 
          error: info 
        });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500)
          .json({ 
            success: false, 
            message: 'Login failed', 
            error: err
           });
        }

        // Use TokenService to generate the token
        const token = TokenService.generateToken(user);
        return res.status(200)
        .json({ 
          success: true, 
          message: 'Authentication successful', 
          token 
        });
      });
    })(req, res, next);
  };
});

AuthController.logout = (req, res) => {
  req.logout(() => { });
  res.redirect('/'); 
};

export default AuthController;