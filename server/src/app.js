const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

// Allow requests from the React frontend
app.use(cors());

// Parse incoming request bodies as JSON
app.use(express.json());

// Health check — lets you confirm the server is running
app.get('/', (req, res) => {
  res.json({ message: 'Church Directory API is running' });
});

app.use('/api/auth', authRoutes);
// app.use('/api/users', usersRoutes); — added in next step

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
