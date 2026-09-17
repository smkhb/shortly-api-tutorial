/**
 * Node modules
 */
import bcrypt from 'bcrypt';

/**
 * Custom modules
 */
import { logger } from '@/lib/winston';
import config from '@/config';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';

/**
 * Models
 */
import User from '@/models/user';

/**
 * Utils
 */
import { generateMongooseId } from '@/utils';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';
type RequestBody = Pick<IUser, 'name' | 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
  // Retrieve name, email, password, and role from the request body
  const { name, email, password, role }: RequestBody = req.body;

  // Check if the user is trying to create an admin account
  if (role === 'admin' && !config.WHITELISTED_EMAILS?.includes(email)) {
    logger.warn(
      `User with email ${email} attempted to create an admin account`,
    );
    res.status(403).json({
      code: 'UNAUTHORIZED',
      message: 'You are not allowed to create an admin account',
    });
    return;
  }
  /**
   * Generate salt to hash the password
   */
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    // Generate custom userId
    const userId = generateMongooseId();

    // Generate refreshToken for registered user
    const refreshToken = generateRefreshToken({ userId });

    //Generate accessToken for registered user
    const accessToken = generateAccessToken({ userId });

    // Insert a new user document in database with provided credentials
    const user = await User.create({
      _id: userId,
      name,
      email,
      password: hashedPassword,
      role,
      refreshToken,
    });

    // Response refreshToken in cookies
    res.cookie('refreshToken', refreshToken, {
      maxAge: config.COOKIE_MAX_AGE, // 7 days in milliseconds
      httpOnly: config.NODE_ENV === 'production', // Set to true in production for security
      secure: true,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        passwordResetToken: user.passwordResetToken,
        role: user.role,
      },
      accessToken,
    });

    logger.info(`User with email ${email} has been registered successfully`);
  } catch (error) {
    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred while registering the user',
    });
    logger.error(
      `An error occurred while registering the user with email ${email}, ${error}`,
    );
    return;
  }
};

export default register;
