const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ Signup
router.post('/signup', async (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const check = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (check.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const result = await db.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, password, address, role]
    );

    res.status(201).json({ message: 'User registered', user: result.rows[0] });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'User not found' });

    const user = result.rows[0];

    if (user.password !== password)
      return res.status(401).json({ error: 'Incorrect password' });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get all users (for admin)
router.get('/users', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, address, role FROM users'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get only stores (for user dashboard)
router.get('/stores', async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, email, address, 0 AS rating FROM users WHERE role = 'store'"
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch stores error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Update password (3.6)
router.put('/users/:id/password', async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ error: 'New password is required' });
  }

  try {
    const result = await db.query(
      'UPDATE users SET password = $1 WHERE id = $2 RETURNING id, email',
      [newPassword, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
