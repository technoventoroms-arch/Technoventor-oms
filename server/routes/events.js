import { Router } from 'express';
import { addClient, removeClient } from '../utils/events.js';

const router = Router();

router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Optional: keep-alive comment every 15 seconds to prevent timeout
  const keepAliveId = setInterval(() => {
    res.write(': keepalive\n\n');
  }, 15000);

  addClient(res);

  req.on('close', () => {
    clearInterval(keepAliveId);
    removeClient(res);
  });
});

export default router;
