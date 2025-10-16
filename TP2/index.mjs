import express from 'express';
import cors from 'cors';
import profileRoutes from './src/routes/profile.routes.mjs';
import darkDataRoutes from './src/routes/darkdata.routes.mjs';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Profile Aggregator API',
    version: '1.0.0',
    endpoints: {
      profiles: '/api/profiles',
      darkdata: '/api/darkdata'
    }
  });
});

app.use('/api/profiles', profileRoutes);
app.use('/api/darkdata', darkDataRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Docs: http://localhost:${PORT}/api/darkdata/stats`);
});