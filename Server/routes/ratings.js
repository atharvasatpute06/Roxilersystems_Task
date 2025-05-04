const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ GET /api/stores/all-with-ratings?userId=123
router.get('/stores/all-with-ratings', async (req, res) => {
  const { userId } = req.query;

  try {
    const result = await db.query(
      `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.address,
        COALESCE(AVG(r.rating), 0)::numeric(2,1) AS average_rating,
        ur.rating AS user_rating
      FROM users u
      LEFT JOIN ratings r ON r.store_id = u.id
      LEFT JOIN ratings ur ON ur.store_id = u.id AND ur.user_id = $1
      WHERE u.role = 'store'
      GROUP BY u.id, ur.rating
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Fetch all store ratings error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ POST /api/ratings — Insert or update a rating
router.post('/ratings', async (req, res) => {
  const { userId, storeId, rating } = req.body;

  if (!userId || !storeId || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  try {
    const check = await db.query(
      'SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2',
      [userId, storeId]
    );

    let result;

    if (check.rows.length > 0) {
      // Update existing rating
      result = await db.query(
        'UPDATE ratings SET rating = $1 WHERE user_id = $2 AND store_id = $3 RETURNING *',
        [rating, userId, storeId]
      );
    } else {
      // Insert new rating
      result = await db.query(
        'INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3) RETURNING *',
        [userId, storeId, rating]
      );
    }

    res.json({ message: 'Rating saved', rating: result.rows[0] });
  } catch (err) {
    console.error('Rating error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
