import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../../config/swagger.js';
import connectDB from '../dbConnection/connection.js';
import authRoutes from '../api/v1/routes/authRoutes.js';
import templateRoutes from '../api/v1/routes/templateRoutes.js';
import purchaseRoutes from '../api/v1/routes/purchaseRoutes.js';

const app = express();
const PORT = 8046;

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: '/api-docs/swagger.json'
  }
}));

// Swagger JSON endpoint
app.get('/api-docs/swagger.json', (req, res) => {
  res.json(swaggerSpec);
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/templates', templateRoutes);
app.use('/api/v1/purchases', purchaseRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Marriage Template Platform API',
    version: '1.0.0',
    docs: 'http://localhost:8046/api-docs',
    health: 'http://localhost:8046/health'
  });
});

app.listen(PORT, () => {
  console.log(`\n✅ Server started on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health\n`);
  connectDB();
});