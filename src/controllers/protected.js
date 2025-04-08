import express from 'express';
import authenticateToken from '../middleware/token_verify.js';

const router = express.Router();

// Protected route
router.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'You have accessed a protected route!',
    user: req.user, // Access the user info from the token
  });
});

export const protectedRoutes = router;