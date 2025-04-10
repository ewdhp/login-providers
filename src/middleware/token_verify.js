import TokenService from '../services/token.js';
import ResponseHandler from '../utils/response.js';

export default function 
authenticateToken(req, res, next) {
  try {
    const token = req.headers
      .authorization?.split(' ')[1];
    if (!token) return ResponseHandler
      .unauthorized(res, 'Token missing');
    const decoded = TokenService.verifyToken(token);
    req.user = decoded; next();
  } catch (error) {
    return ResponseHandler.unauthorized
      (res, 'Invalid token');
  }
}