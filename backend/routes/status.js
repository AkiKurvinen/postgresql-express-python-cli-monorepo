const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /status:
 *   get:
 *     summary: server status check
 *     responses:
 *       200:
 *         description: API is running
 */
router.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

module.exports = router;
