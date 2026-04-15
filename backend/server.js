require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const adRoutes = require('./routes/ads');
const messageRoutes = require('./routes/messages');
const uploadRoutes = require('./routes/upload');
const settingsRoutes = require('./routes/settings');
const legalRoutes = require('./routes/legal');

const app = express();

const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: 'Too many attempts, please try again later',
});

const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// Set CORS_ALLOWED_ORIGINS in production .env as a comma-separated list of frontend URLs.
const allowedOrigins = [
  ...(process.env.CORS_ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean);

// Middleware
app.use(cors({
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api', generalApiLimiter);

// Ensure DB connection before API handlers (safe for serverless cold starts)
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database init error:', error.message);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// API Routes
app.use('/api/auth', strictAuthLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/legal', legalRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'daberli-backend' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT;

if (!process.env.VERCEL) {
  app.listen(PORT || 5000, () => {
    console.log(`Server running on port ${PORT || 5000}`);
  });
}

module.exports = app;
