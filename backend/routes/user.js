const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth'); 
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 description: Optional user role, defaults to 'client'. Can be 'client' or 'admin'.
 *                 enum:
 *                   - client
 *                   - admin
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Accept role as 'admin' or 'client' (case-insensitive), default to 'client'
    let userRole = 'client';
    if (typeof role === 'string' && role.toLowerCase() === 'admin') {
      userRole = 'admin';
    }

    // Check if user already exists in DB
    const existingUser = await db('users').where({ username }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into DB and return the inserted row (PostgreSQL)
    const [user] = await db('users')
      .insert({ username, password: hashedPassword, role: userRole })
      .returning(['userid', 'username', 'role']);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.userid, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.userid,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /users/{username}:
 *   delete:
 *     summary: Delete a user by username
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       401:
 *         description: Access token required
 *       403:
 *         description: Forbidden: insufficient rights
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/users/:username', authenticateToken, async (req, res) => {
  try {
    const { username } = req.params;
    // Only allow admin or self-delete
    if (req.user.role !== 'admin' && req.user.username !== username) {
      return res.status(403).json({ error: 'Forbidden: insufficient rights' });
    }
    const deleted = await db('users').where({ username }).del();
    if (deleted) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;