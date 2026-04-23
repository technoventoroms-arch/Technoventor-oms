import app from './app.js';
import { createTables } from './schema.js';

const PORT = process.env.PORT || 3001;

// Initialize Database & Run Migrations
createTables()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1);
  });
