import TokenService from '../services/token.js';
import ResponseHandler from '../utils/response.js';

// Middleware to authenticate tokens from headers
export function authenticateToken(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return ResponseHandler.unauthorized(res, 'Token missing');
    }

    const decoded = TokenService.verifyToken(token);
    req.user = decoded; // Attach decoded user info to the request
    req.accessToken = decoded.accessToken; // Attach access token to the request
    next();
  } catch (error) {
    return ResponseHandler.unauthorized(res, 'Invalid token');
  }
}

// Middleware to validate access tokens from query parameters
export function tokenMiddleware(req, res, next) {
  const { access_token } = req.query;
  if (!access_token) {
    return ResponseHandler.unauthorized(res, 'Access token is missing');
  }

  req.accessToken = access_token; // Attach access token to the request
  next();
}