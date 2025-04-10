import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error('JWT_SECRET not defined in environment variables');
}

const tokenExpiry = process.env.JWT_EXPIRY || '1h';

const TokenService = {
  generateToken: (user, ip, userAgent, additionalPayload = {}) => {
    const payload = {
      id: user.id,
      email: user.email,
      ip,
      userAgent,
      ...additionalPayload,
    };
    return jwt.sign(payload, secret, { expiresIn: tokenExpiry });
  },

  verifyToken: (token, currentIp, currentUserAgent) => {
    try {
      const decoded = jwt.verify(token, secret);
      if (decoded.ip !== currentIp) throw new Error('IP address mismatch');
      if (decoded.userAgent !== currentUserAgent) throw new Error('User Agent mismatch');
      return decoded;
    } catch (err) {
      throw new Error(`Invalid token: ${err.message}`);
    }
  },

  refreshToken: (token, currentIp, currentUserAgent) => {
    try {
      const payload = jwt.verify(token, secret, { ignoreExpiration: true });
      if (payload.ip !== currentIp) throw new Error('IP address mismatch');
      if (payload.userAgent !== currentUserAgent) throw new Error('User Agent mismatch');
      delete payload.iat;
      delete payload.exp;
      return jwt.sign(payload, secret, { expiresIn: tokenExpiry });
    } catch (err) {
      throw new Error(`Cannot refresh token: ${err.message}`);
    }
  },
};
export default TokenService;