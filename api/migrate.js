import pool from '../server/db.js';
import { createTables } from '../server/schema.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await createTables();
    res.status(200).json({ message: 'Database migrated successfully!' });
  } catch (error) {
    console.error('Migration failed:', error);
    res.status(500).json({ error: 'Migration failed', details: error.message });
  }
}
