import TokenService from '../services/token/jwt_token.js';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token missing', // Standardized message
    });
  }

  try {
    const decoded = TokenService.verifyToken(token); // Verify the token
    req.user = decoded; // Attach the decoded user info to the request object
    next(); // Proceed to the next middleware or controller
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid token', // Standardized message
    });
  }
};

export default authenticateToken;