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
import type { Request, Response, NextFunction } from 'express';
type Role = 'admin' | 'user';

const authorization = (role: Role[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    // Extract the user from the request object
    const userId = req.userId;

    try {
      // Find user by id
      const user = await User.findById(userId).select('role').lean().exec();

      // Handle case when user not found
      if (!user) {
        res.status(403).json({
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        });
        return;
      }

      // Handle case when user doesn't have the role access
      if (!role.includes(user.role)) {
        res.status(403).json({
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this resource',
        });
        return;
      }

      // If user has the role access, proceed to the next middleware
      next();
    } catch (error) {
      // Response with a 500 status code for unexpected server errors
      res.status(500).json({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      });
      logger.error('Authorization middleware error:', error);
    }
  };
};

export default authorization;
