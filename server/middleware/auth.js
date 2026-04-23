import jwt from 'jsonwebtoken';
import pool from '../db.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-fallback-secret');
    
    // Fetch latest user details to ensure permissions are up to date
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }
    
    const user = result.rows[0];
    if (!user.is_active) {
      return res.status(403).json({ error: 'Unauthorized: Account is disabled' });
    }
    
    req.user = {
      id: user.id,
      email: user.email,
      department: user.department,
      permissions: user.permissions || []
    };
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export default authMiddleware;
