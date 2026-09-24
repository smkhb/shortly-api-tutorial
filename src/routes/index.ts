/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Routes
 */
import authRoute from '@/routes/auth';
import userRoute from '@/routes/user';

/**
 * Initial express router
 * @description This section initializes the Express router, which is used to define the application's route handlers and endpoints.
 */
const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live!',
    status: 'ok',
    version: '1.0.0',
    docs: '/docs',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
router.use('/auth', authRoute);

// User routes
router.use('/users', userRoute);

export default router;
