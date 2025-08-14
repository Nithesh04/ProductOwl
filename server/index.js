const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');



// Import routes
const productRoutes = require('./routes/products');
const trackingRoutes = require('./routes/tracking');
const authRoutes = require('./routes/auth');

// Import cron job
const { checkPricesAndNotify } = require('./utils/cronJob');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;




// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CLIENT_URL,
      'https://product-owl-nine.vercel.app',
      'https://product-owl-eight.vercel.app',
      'http://localhost:5173', // For local development
      'http://localhost:3000'  // Alternative local port
    ];
    
    // Allow any Vercel domain
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.log('CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/productowl', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/tracking', trackingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ProductOwl API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint for testing
app.get('/api', (req, res) => {
  res.json({ 
    message: 'ProductOwl API Root',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      tracking: '/api/tracking',
      auth: '/api/auth'
    },
    clientUrl: process.env.CLIENT_URL,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Debug endpoint to check environment variables
app.get('/api/debug', (req, res) => {
  res.json({
    clientUrl: process.env.CLIENT_URL,
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
    timestamp: new Date().toISOString(),
    corsInfo: {
      allowedOrigins: [
        process.env.CLIENT_URL,
        'https://product-owl-nine.vercel.app',
        'https://product-owl-eight.vercel.app',
        'Any vercel.app domain'
      ]
    }
  });
});

// Test scraper endpoint
app.get('/api/test-scraper', async (req, res) => {
  try {
    const testUrl = 'https://www.amazon.in/dp/B08N5WRWNW'; // Example Amazon product
    console.log('Testing scraper with URL:', testUrl);
    
    const scraper = require('./utils/scraper');
    const result = await scraper.scrapeProduct(testUrl);
    
    res.json({
      success: true,
      message: 'Scraper test successful',
      data: result
    });
  } catch (error) {
    console.error('Scraper test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Scraper test failed',
      error: error.message
    });
  }
});


// Serve React app in production if build exists
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.resolve(__dirname, '..', 'client', 'dist');
  const indexHtmlPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    app.use(express.static(clientDistPath));
    app.get('*', (req, res) => {
      res.sendFile(indexHtmlPath);
    });
  } else {
    console.log('client/dist not found; serving API only');
  }
}

// Start CRON job to check prices daily at 7 AM
cron.schedule('0 7 * * *', () => {
  console.log('Running daily price check...');
  checkPricesAndNotify();
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
