import passport from 'passport';
import { authStrategies } from '../config/passport.js';


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

        const token = generateToken(user);
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