/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all users
 *     tags:
 *       - Users
 *     description: Returns a list of all users. No authentication required.
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userid:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   role:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const { authenticateToken } = require('./auth');


router.get('/users', async (req, res) => {
  try {
    const users = await db('users').select('userid', 'username', 'role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Register a new user
 *     tags:
 *       - Users
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
router.put('/users', async (req, res) => {
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

    res.status(201).json({
      message: 'User registered successfully',
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
 *       - Users
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
 *         description: "Forbidden: insufficient rights"
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