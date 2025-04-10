import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { verifyTokenMiddleware } from './src/middleware/token.js';
import authRoutes from './src/controllers/auth.js';
import { socialRoutes } from './src/controllers/social.js';

// Load environment variables
dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(helmet()); // Secure HTTP headers
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true })); 
app.use(morgan(isProduction ? 'combined' : 'dev')); // Logging
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public')); // Serve static files

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: isProduction, httpOnly: true, maxAge: 3600000 }, // 1 hour
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api', verifyTokenMiddleware(), socialRoutes);

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
const sslKeyPath = './certs/server.key';
const sslCertPath = './certs/server.cert';
if (!fs.existsSync(sslKeyPath) || !fs.existsSync(sslCertPath)) {
  console.error('SSL certificate or key file is missing.');
  process.exit(1);
}

// Load SSL certificate and key
const sslOptions = {
  key: fs.readFileSync(sslKeyPath),
  cert: fs.readFileSync(sslCertPath),
};

// Start HTTPS Server only if this file is run directly
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT}`);
  });
}

export default app; // Export the app instance for testing