import { Router } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is disabled' });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, department: user.department },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Map to frontend shape
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department,
        permissions: user.permissions || [],
        isActive: user.is_active
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is disabled' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department,
      permissions: user.permissions || [],
      isActive: user.is_active
    });
  } catch (err) {
    console.error('Auth check error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
