const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');

dotenv.config();

const app = express();

// Allow requests from the React frontend.
// CORS_ORIGIN is set to the Vercel URL in production; falls back to localhost in dev.
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}));

// Parse incoming request bodies as JSON
app.use(express.json());

// Health check — lets you confirm the server is running
app.get('/', (req, res) => {
  res.json({ message: 'Church Directory API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

// Must come after all routes — Express knows this is an error handler because it has 4 arguments.
// Catches any unhandled error thrown in async route handlers and returns a clean JSON response.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
