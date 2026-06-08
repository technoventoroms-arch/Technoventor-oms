import app from '../server/app.js';
import { createTables } from '../server/schema.js';

let initPromise = null;

function ensureDbReady() {
  if (!initPromise) {
    initPromise = createTables().catch((err) => {
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}

export default async function handler(req, res) {
  try {
    await ensureDbReady();
  } catch (err) {
    console.error('Database initialization failed:', err);
    return res.status(500).json({ error: 'Database initialization failed' });
  }
  return app(req, res);
}
