const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('./auth');

/**
 * @swagger
 * /machines/user/{user_id}:
 *   get:
 *     summary: Get all machines for a user
 *     tags:
 *       - Machines
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of machines for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   registered_date:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Access token required
 *       403:
 *         description: "Forbidden: insufficient rights"
 *       500:
 *         description: Internal server error
 */
router.get('/machines/user/:user_id', authenticateToken, async (req, res) => {
  const { user_id } = req.params;
  try {
    // Only allow access to own machines or if admin
    if (parseInt(user_id) !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: insufficient rights' });
    }
    const machines = await db('machines').where({ user_id });
    res.json(machines);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
