import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';

import authRoutes from './src/apis/auth.js';
import cosmicraftsRoutes from './src/apis/cosmicrafts.js';

// Load environment variables
dotenv.config();

const app = express();

// Session and Passport middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/cosmicrafts', cosmicraftsRoutes);


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; 