const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ GET /api/store/ratings/:storeId — View ratings received by a store owner
router.get('/ratings/:storeId', async (req, res) => {
  const { storeId } = req.params;

  try {
    // Get all ratings with the names of users who rated this store
    const result = await db.query(
      `
      SELECT 
        u.name AS user,
        r.rating
      FROM ratings r
      JOIN users u ON u.id = r.user_id
      WHERE r.store_id = $1
      `,
      [storeId]
    );

    // Get average rating of the store
    const avgResult = await db.query(
      'SELECT AVG(rating)::numeric(2,1) AS average FROM ratings WHERE store_id = $1',
      [storeId]
    );

    res.json({
      ratings: result.rows,
      average: avgResult.rows[0].average || '0.0'
    });
  } catch (err) {
    console.error('❌ Fetch store ratings error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
