const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Apply CORS first
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ Parse JSON body
app.use(express.json());

// ✅ Import and use routes
const authRoutes = require('./routes/auth');
const ratingRoutes = require('./routes/ratings');
const storeRoutes = require('./routes/store'); // ✅ Your new store route

app.use('/api', authRoutes);
app.use('/api', ratingRoutes);
app.use('/api/store', storeRoutes); // ✅ Make sure this is after middleware

// ✅ Default root route
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

// ✅ Test DB connection
db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ DB connection failed:', err);
  } else {
    console.log('✅ PostgreSQL connected at:', res.rows[0].now);
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
