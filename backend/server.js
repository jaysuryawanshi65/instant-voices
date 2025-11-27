const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/instant-voices')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
const voiceRoutes = require('./routes/voices');
app.use('/api/voices', voiceRoutes);

// Basic Auth Route (Guest)
app.post('/api/auth/guest', (req, res) => {
  // Generate a random user ID
  const crypto = require('crypto');
  const userId = crypto.randomUUID();
  res.json({ userId });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
