/**
 * Node modules
 */

/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Models
 */
import User from '@/models/user';

/**
 * Types
 */
import type { Request, Response } from 'express';

const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;

  try {
    // TODO: Delete all links associated with current user

    // Find user by id and delete
    await User.deleteOne({ _id: userId }).exec();

    // Send response to the client indicating successful deletion
    res.status(200).json({
      code: 'USER_DELETED',
      message: 'User account has been successfully deleted',
    });
  } catch (error) {
    // Response with a 500 status code for unexpected server errors
    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    });
    logger.error('Error during deleting current user: ', error);
  }
};

export default getCurrentUser;
