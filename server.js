const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Allowed explicit static origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://expense-tracker-lite-rho.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

// Dynamic, robust CORS setup to support Vercel preview deployments
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
      if (!origin) return callback(null, true);

      // Check if origin matches allowed list OR ends with vercel.app
      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app');

      if (isAllowed) {
        return callback(null, true);
      } else {
        return callback(new Error('CORS policy violation: Origin not allowed'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Explicit preflight request handling
app.options('*', cors());

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'TrackLite API is running' });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Database Connection Error:', err.message);
    process.exit(1);
  });