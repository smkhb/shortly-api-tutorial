/**
 * Node modules
 */

/**
 * Custom modules
 */
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import config from '@/config';

/**
 * Models
 */
import User from '@/models/user';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';

type RequestBody = Pick<IUser, 'email'>;

const login = async (req: Request, res: Response): Promise<void> => {
  const { email }: RequestBody = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    // return if user is not found
    if (!user) return;

    const refreshToken = generateRefreshToken({ userId: user._id });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      maxAge: config.COOKIE_MAX_AGE, // 7 days
      httpOnly: config.NODE_ENV === 'production',
      secure: true,
    });

    const accessToken = generateAccessToken({ userId: user._id });

    res.status(200).json({
      message: 'User logged in successfully',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
    });
  } catch (error) {
    // Handle any unexpected errors that may occur during the login process
    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred while registering the user',
    });

    // Log the error for debugging purposes
    logger.error(`An error occurred during login for user ${email}, ${error}`);
    return;
  }
};

export default login;
