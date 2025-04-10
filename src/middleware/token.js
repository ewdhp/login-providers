import TokenService from '../services/token.js';
import ResponseHandler from '../utils/response.js';

// Helper function to extract token from headers or query parameters
const extractToken = (req) => {
  const token = req.headers.authorization?.split(' ')[1] || req.query.access_token;
  if (!token) throw new Error('Token missing');
  return token;
};

// Middleware to verify a token and validate roles (if required)
export const verifyTokenMiddleware = (requiredRoles = []) => (req, res, next) => {
  try {
    const token = extractToken(req);
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const decoded = TokenService.verifyToken(token, ip, userAgent);

    // Check for required roles
    if (requiredRoles.length && !requiredRoles.some((role) => decoded.roles.includes(role))) {
      return ResponseHandler.unauthorized(res, 'Insufficient permissions');
    }

    // Attach decoded user info and token to the request
    req.user = decoded;
    req.accessToken = token;
    next();
  } catch (error) {
    return ResponseHandler.unauthorized(res, error.message);
  }
};

// Middleware to refresh a token
export const refreshTokenMiddleware = (req, res) => {
  try {
    const token = extractToken(req);
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const newToken = TokenService.refreshToken(token, ip, userAgent);

    return ResponseHandler.success(res, 'Token refreshed successfully', { token: newToken });
  } catch (error) {
    return ResponseHandler.unauthorized(res, error.message);
  }
};

// Middleware to generate a token after successful authentication
export const generateTokenMiddleware = (req, res, next) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const token = TokenService.generateToken(req.user, ip, userAgent);

    // Attach the generated token to the request
    req.token = token;
    next();
  } catch (error) {
    return ResponseHandler.internalError(res, 'Failed to generate token');
  }
};