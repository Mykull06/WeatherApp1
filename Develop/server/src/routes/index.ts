import { Router } from 'express';
const router = Router();

import htmlRoutes from './htmlRoutes.js';
import weatherRoutes from './api/weatherRoutes.js';

router.use('/', htmlRoutes);
router.use('/api/weather', weatherRoutes);

export default router;
