import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';

import authRoutes from './src/controllers/auth.js';
import { protectedRoutes } from './src/controllers/protected.js';

// Load environment variables
dotenv.config();

const app = express();

// Passport middleware
app.use(passport.initialize());

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api', protectedRoutes); // Add protected routes

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;