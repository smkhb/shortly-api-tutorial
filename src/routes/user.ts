/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Custom modules
 */
import expressRateLimit from '@/lib/expressRateLimit';

/**
 * Controllers
 */
import getCurrentUser from '@/controllers/user/getCurrentUser';
import deleteCurrentUser from '@/controllers/user/deleteCurrentUser';

/**
 * Middlewares
 */
import validationError from '@/middlewares/validationError';
import authentication from '@/middlewares/authentication';
import authorization from '@/middlewares/authorization';

/**
 * Models
 */

/**
 * Initial express router
 * This section initializes an Express router instance, which is used to define and handle routes for the user-related endpoints.
 */
const router = Router();

// Get a route for current user
router.get(
  '/current',
  expressRateLimit('basic'),
  authentication,
  authorization(['admin', 'user']),
  getCurrentUser,
  validationError,
);

// Delete route for current user
router.delete(
  '/current',
  expressRateLimit('basic'),
  authentication,
  authorization(['admin', 'user']),
  deleteCurrentUser,
  validationError,
);

export default router;
