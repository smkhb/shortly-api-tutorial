/**
 * Node modules
 */
import bcrypt from 'bcrypt';

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

const updateCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.userId;
  const requestedUpdates = req.body;

  // Handle case where the user wants to update their password
  if (requestedUpdates.new_password) {
    // Hash the new password before saving it to the database
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(
      requestedUpdates.new_password,
      salt,
    );
    requestedUpdates.password = hashedPassword;
  }

  try {
    await User.updateOne({ _id: userId }, requestedUpdates).exec();

    res.status(200).json({
      code: 'USER_UPDATED',
      message: 'User account has been successfully updated',
    });
  } catch (error) {
    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred while updating the current user',
    });
    logger.error(`Error during updating current user ${userId}: ${error}`);
  }
};

export default updateCurrentUser;
