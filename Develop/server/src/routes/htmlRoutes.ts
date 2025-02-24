import path from 'path';
import { fileURLToPath } from 'url';
import { Router } from 'express';

const router = Router();

// ES Module-compatible way to define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve index.html for the root route
const clientDistFolder = path.resolve(__dirname, '../../../client/dist');
router.get('/', (_req, res) => {
  res.sendFile(path.join(clientDistFolder, 'index.html'));
});

export default router;
