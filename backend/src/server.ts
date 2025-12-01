import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { initDatabase } from './database';
import inventoryRoutes from './routes/inventoryRoutes';
import { requestLogger, errorHandler, notFoundHandler } from './middleware';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: ['http://localhost:3000'], // Allow frontend origin
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies
app.use(requestLogger); // Log requests

// Routes
app.use('/api/items', inventoryRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Warehouse Inventory API'
  });
});

// API documentation endpoint
app.get('/api-docs', (req, res) => {
  res.json({
    endpoints: {
      'GET /api/items': 'Get all inventory items',
      'GET /api/items/:id': 'Get single item',
      'POST /api/items': 'Create new item',
      'PUT /api/items/:id': 'Update item',
      'DELETE /api/items/:id': 'Delete item',
      'GET /api/items/stats': 'Get inventory statistics',
      'GET /api/items/categories': 'Get all categories',
      'GET /health': 'Health check'
    },
    queryParameters: {
      'search': 'Search items by name or category',
      'category': 'Filter by category'
    }
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Initialize database
    await initDatabase();
    console.log('Database initialized successfully');
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;