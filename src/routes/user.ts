/**
 * Node modules
 */
import { Router } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcrypt';

/**
 * Custom modules
 */
import expressRateLimit from '@/lib/expressRateLimit';

/**
 * Controllers
 */
import getCurrentUser from '@/controllers/user/getCurrentUser';
import deleteCurrentUser from '@/controllers/user/deleteCurrentUser';
import updateCurrentUser from '@/controllers/user/updateCurrentUser';

/**
 * Middlewares
 */
import validationError from '@/middlewares/validationError';
import authentication from '@/middlewares/authentication';
import authorization from '@/middlewares/authorization';

/**
 * Models
 */
import User from '@/models/user';

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

// Patch route for current user
router.patch(
  '/current',
  expressRateLimit('basic'),
  authentication,
  authorization(['admin', 'user']),
  body('name').optional().trim(),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (email) => {
      // Check if the email already exists in the database
      const userExists = await User.exists({ email }).exec();

      // Handle case when duplicate email is found
      if (userExists) {
        throw new Error('Email already in use');
      }
    }),
  body('current_password')
    .optional()
    .trim()
    .custom(async (currentPassword, { req }) => {
      const userId = req.userId;

      const user = await User.findById(userId).select('password').lean().exec();
      if (!user) return;

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        throw new Error('Current password is incorrect');
      }
    }),
  body('new_password')
    .optional()
    .trim()
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .custom(() => {
      throw new Error('Role cannot be updated');
    }),
  validationError,
  updateCurrentUser,
);

export default router;
