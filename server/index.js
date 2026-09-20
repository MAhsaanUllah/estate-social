require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

// Validate Environment Secrets in Production
if (process.env.NODE_ENV === 'production') {
  const insecureSecrets = ['secret', 'changeme', 'your-secret', 'password123', 'estatesocial_secret_key_pk_2026', 'estatesocial_dev_secret_2026'];
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret.length < 16 || insecureSecrets.includes(jwtSecret.toLowerCase())) {
    console.error('❌ CRITICAL SECURITY ERROR: Strong JWT_SECRET (minimum 16 characters) is required in production.');
    console.error('Please configure a secure, randomized JWT_SECRET in environment variables.');
    process.exit(1);
  }
}

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const listingRoutes = require('./routes/listingRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const postRoutes = require('./routes/postRoutes');
const valuationRoutes = require('./routes/valuationRoutes');

// Connect to MongoDB
connectDB();

const app = express();

app.use(helmet());

// Production-Safe CORS Configuration
const isProduction = process.env.NODE_ENV === 'production';
const configuredOrigins = [process.env.CORS_ORIGIN, process.env.CLIENT_URL]
  .filter(Boolean)
  .flatMap(o => o.split(',').map(s => s.trim()));

const allowedOrigins = [
  ...configuredOrigins,
  !isProduction && 'http://localhost:5173',
  !isProduction && 'http://127.0.0.1:5173',
  !isProduction && 'http://localhost:5174',
  !isProduction && 'http://127.0.0.1:5174',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      if (isProduction) {
        callback(new Error('Blocked by CORS security policy'));
      } else {
        callback(null, true);
      }
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

// NoSQL Injection Sanitization & HTTP Parameter Pollution Defense
app.use(mongoSanitize());
app.use(hpp());

// General Browsing Rate Limiter: 300 requests / 15 min per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api', generalLimiter);

// Strict Targeted Rate Limiter for Authentication: 20 attempts / 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts. Please try again in 15 minutes.' },
});

// Strict Rate Limiter for KYC Document Submissions: 10 attempts / 15 min
const kycLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many verification submissions. Please try again in 15 minutes.' },
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EstateSocial API is live', environment: process.env.NODE_ENV || 'development' });
});

// Route mountings
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users/kyc', kycLimiter);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/valuations', valuationRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 EstateSocial API server running on port ${PORT}`));