/**
 * Node modules
 */
import { Router } from 'express';
import { body, query, param } from 'express-validator';

/**
 * Custom modules
 */
import expressRateLimit from '@/lib/expressRateLimit';

/**
 * Controllers
 */
import createShortLink from '@/controllers/link/createShortLink';

/**
 * Middlewares
 */
import validationError from '@/middlewares/validationError';
import authentication from '@/middlewares/authentication';
import authorization from '@/middlewares/authorization';

/**
 * Models
 */
import Link from '@/models/link';

/**
 * Initial express router
 * This section initializes an Express router instance, which is used to define and handle routes for the user-related endpoints.
 */
const router = Router();

router.post(
  '/generate',
  expressRateLimit('basic'),
  authentication,
  authorization(['admin', 'user']),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('destination')
    .trim()
    .notEmpty()
    .withMessage('Destination is required')
    .isURL()
    .withMessage('Invalid URL'),
  body('backHalf').optional().trim().custom(async (value) => { 
    // Check if the backHalf already exists in the database
    const backHalfExists = await Link.exists({ backHalf: value }).exec();

    // Handle case when given backHalf is already in use
    if (backHalfExists) {
      throw new Error('Back half already in use');
    }
  }),
  validationError,
  createShortLink,
);

export default router;
