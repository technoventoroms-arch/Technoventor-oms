import { Router } from 'express';
import pool from '../db.js';
import { emitUpdate } from '../utils/events.js';

const router = Router();

// Helper: map DB row to frontend shape
function mapUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    department: row.department,
    password: row.password,
    permissions: row.permissions || [],
    isActive: row.is_active
  };
}

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    res.json(result.rows.map(mapUser));
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const { name, email, department, password, permissions, isActive } = req.body;
    const result = await pool.query(
      `INSERT INTO users (name, email, department, password, permissions, is_active)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, email, department, password, permissions || [], isActive !== false]
    );
    emitUpdate('users_updated');
    res.status(201).json(mapUser(result.rows[0]));
  } catch (err) {
    console.error('Error creating user:', err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department, password, permissions, isActive } = req.body;

    const result = await pool.query(
      `UPDATE users SET
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        department = COALESCE($3, department),
        password = COALESCE($4, password),
        permissions = COALESCE($5, permissions),
        is_active = COALESCE($6, is_active)
       WHERE id = $7 RETURNING *`,
      [name, email, department, password, permissions, isActive, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    emitUpdate('users_updated');
    res.json(mapUser(result.rows[0]));
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    emitUpdate('users_updated');
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
