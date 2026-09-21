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
import register from '@/controllers/auth/register';
import login from '@/controllers/auth/login';
import logout from '@/controllers/auth/logout';

/**
 * Middlewares
 */
import validationError from '@/middlewares/validationError';
import authentication from '@/middlewares/authentication';

/**
 * Models
 */
import User from '@/models/user';

/**
 * Initial express router
 * @description This section initializes an Express router instance, which is used to define and handle routes for the authentication-related endpoints.
 */
const router = Router();

/**
 * Post route to register user
 */
router.post(
  `/register`,
  expressRateLimit('auth'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      // Check if the email already exists in the database
      const userExists = await User.exists({ email: value }).exec();

      // Handle case when duplacte email is found
      if (userExists) {
        throw new Error('Email already in use');
      }
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['user', 'admin'])
    .withMessage('Role not allowed'),
  validationError,
  register,
);

/**
 * Post route to login user
 */
router.post(
  `/login`,
  expressRateLimit('auth'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      // Check if the email already exists in the database
      const userExists = await User.exists({ email: value }).exec();

      // Handle case when email is not found in the database
      if (!userExists) {
        throw new Error('Email not found');
      }
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .custom(async (password, { req }) => {
      const { email } = req.body;
      const user = await User.findOne({ email })
        .select('password')
        .lean()
        .exec();

      if (!user) return;

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
    }),
  validationError,
  login,
);

router.delete(`/logout`, expressRateLimit('basic'), authentication, logout);

export default router;
