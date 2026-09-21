/**
 * Custom modules
 */
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

const logout = async (req: Request, res: Response): Promise<void> => {
  // Retrieve the userId from request
  const userId = req.userId;

  try {
    // Set current refreshToken to null
    await User.updateOne({ _id: userId }, { refreshToken: null }).exec();

    // Clear the cookie from client
    res.clearCookie('refreshToken', {
      maxAge: config.COOKIE_MAX_AGE,
      httpOnly: config.NODE_ENV === 'production',
      secure: true,
    });

    // Response success with no message
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred while logging out',
    });
    logger.error(`Error during logout for userId ${userId}: ${error}`);
  }
};

export default logout;
