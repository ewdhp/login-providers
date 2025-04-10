import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error('JWT_SECRET not in env');
}
const tokenExpiry = '1h'; 

const TokenService = {
  // Generate a new token
  generateToken: (user) => {
    const payload = {
      id: user.id,
      email: user.email,};
    return jwt.sign(payload, secret, 
      { expiresIn: tokenExpiry });
  },

  // Verify a token
  verifyToken: (token) => {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      throw new Error('Invalid token');
    }
  },

  // Refresh a token
  refreshToken: (token) => {
    try {
      const payload = jwt.verify
      ( token, secret, 
      { ignoreExpiration: true });
      delete payload.iat;
      delete payload.exp; 
      return jwt.sign(payload, secret, 
        { expiresIn: tokenExpiry });
    } catch (err) {
      throw new Error('Invalid token');
    }
  },
};

export default TokenService;