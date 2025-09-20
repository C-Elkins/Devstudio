const express = require('express');
const router = express.Router();

// GET /api/testimonials - return static list for now (replace with DB later)
router.get('/', async (req, res) => {
  res.json({
    success: true,
    data: [
      { author: 'Client A', message: 'Fantastic work and great communication.' },
      { author: 'Client B', message: 'Delivered on time with excellent quality.' }
    ]
  });
});

module.exports = router;
