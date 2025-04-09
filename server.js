import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import session from 'express-session'; // Import express-session

import authRoutes from './src/controllers/auth.js';
import { protectedRoutes } from './src/controllers/protected.js';

// Load environment variables
dotenv.config();

const app = express();

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use the SESSION_SECRET from .env
    resave: false, // Prevent session from being saved back to the store if it wasn't modified
    saveUninitialized: false, // Don't save uninitialized sessions
    cookie: { secure: true }, // Use secure cookies (requires HTTPS)
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session()); // Enable persistent login sessions

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve static files (e.g., index.html)
app.use(express.static('public'));

// Routes
app.use('/auth', authRoutes);
app.use('/api', protectedRoutes); // Add protected routes

// Load SSL certificate and key
const sslOptions = {
  key: fs.readFileSync('./certs/server.key'), // Path to private key
  cert: fs.readFileSync('./certs/server.cert'), // Path to certificate
};

// Start HTTPS Server
const PORT = process.env.PORT || 3000;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});

export default app;