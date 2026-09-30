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
import redirect from '@/controllers/redirect/redirect';

/**
 * Middlewares
 */

/**
 * Models
 */

/**
 * Initial express router
 * This section initializes an Express router instance, which is used to define and handle routes for the user-related endpoints.
 */
const router = Router();

router.get('/:backHalf', expressRateLimit('basic'), redirect);

export default router;
