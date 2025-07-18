import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Add CORS headers to handle cross-origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    message: '✅ Server is working!',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Root route for basic health check
app.get('/', (req, res) => {
  res.json({
    message: 'API Server is running',
    endpoints: {
      test: '/test',
      menu: '/api/menu'
    }
  });
});

console.log('🔄 About to import menu routes...');

// Import menu routes
import menuRoutes from './routes/menu.js';

console.log('✅ Menu routes imported successfully');

// API routes
app.use('/api/menu', menuRoutes);

console.log('✅ Menu routes registered successfully');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    // Listen on all interfaces (0.0.0.0) instead of just localhost
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Local: http://localhost:${PORT}`);
      console.log(`Network: http://0.0.0.0:${PORT}`);
      console.log(`Test endpoint: http://localhost:${PORT}/test`);
    });
  })
  .catch((err) => {
    console.error(' MongoDB connection error:', err);
    process.exit(1);
  });