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
  try {
    // Get userId from request object
    const userId = req.userId;

    // Find user by id
    const user = await User.findById(userId).select('-__v').lean().exec();

    // Respond success
    res.status(200).json({
      code: 'SUCCESS',
      message: 'Current user retrieved successfully',
      data: { user },
    });

  } catch (error) {
    // Response with a 500 status code for unexpected server errors
    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    });
    logger.error('Error during getting current user: ', error);
  }
};

export default getCurrentUser;
