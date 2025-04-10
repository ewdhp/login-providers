import TokenService from '../services/token/jwt_token.js';
import ResponseHandler from '../utils/response.js';

export default function authenticateToken(req, res, next) {
  console.log('Authenticating token...');
  console.log('Request URL:', req.url);
  console.log('Headers:', req.headers); // Log all headers
  console.log('Authorization Header:', req.headers.authorization); // Log the Authorization header

  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.error('Token is missing');
      return res.status(401).json({ success: false, message: 'Token missing' });
    }

    console.log('Token found:', token);

    // Add your token verification logic here
    // Example: Verify the token using a JWT library
    const decoded = TokenService.verifyToken(token); // Replace with your token verification logic
    console.log('Decoded token:', decoded);

    // If token is valid, attach the decoded payload to the request and call next()
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token authentication failed:', error.message);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
}