/**
 * Custom modules
 */
import { generatePasswordResetToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';

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

const forgotPassword = async (req: Request, res: Response) => {
  // Extract the email from the request body
  const { email }: RequestBody = req.body;

  try {
    // Find the user by email
    const passwordResetToken = generatePasswordResetToken({ email });

    // Find the user by email and update the passwordResetToken field
    const user = await User.findOne({ email })
      .select('name passwowrdResetToken')
      .exec();

    // If the user is not found, return a 404 status code
    if (!user) return;

    // Send the reset token to user email

    // Store the reset token in user data and save
    user.passwordResetToken = passwordResetToken;
    await user.save();

    res.status(204).end();
  } catch (error) {
    logger.error(
      'Error occurred while processing forgot password request:',
      error,
    );
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default forgotPassword;
