import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';
import eventsRoutes from './routes/events.js';
import authMiddleware from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

import { createTables } from './schema.js';
app.get('/api/run-migration', async (req, res) => {
  try {
    await createTables();
    res.json({ success: true, message: 'Migrations completed successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Migration failed', details: error.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/orders', authMiddleware, orderRoutes);
app.use('/api/events', eventsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
