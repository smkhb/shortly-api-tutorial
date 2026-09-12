/**
 * Node modules
 */
import { Router } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcryptjs';

/**
 * Controllers
 */
import register from '@/controllers/auth/register';

/**
 * Middlewares
 */
import validationError from '@/middlewares/validationError';

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
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async () => {
      // Todo this process after configuring 'User'model
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

export default router;
