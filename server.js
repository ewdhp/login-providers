import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authenticateToken from './src/middleware/token_verify.js';
import authRoutes from './src/controllers/auth.js';
import { facebookRoutes } from './src/controllers/facebook.js';

// Load environment variables
dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(helmet()); // Secure HTTP headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public')); // Serve static files

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: isProduction },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api', authenticateToken, facebookRoutes);


// Default route for undefined endpoints
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Validate SSL files
if (!fs.existsSync('./certs/server.key') || !fs.existsSync('./certs/server.cert')) {
  console.error('SSL certificate or key file is missing.');
  process.exit(1);
}

// Load SSL certificate and key
const sslOptions = {
  key: fs.readFileSync('./certs/server.key'),
  cert: fs.readFileSync('./certs/server.cert'),
};

// Start HTTPS Server only if this file is run directly
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT}`);
  });
}

export default app; // Export the app instance for testing