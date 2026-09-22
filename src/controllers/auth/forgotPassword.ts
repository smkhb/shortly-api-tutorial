/**
 * Custom modules
 */
import { generatePasswordResetToken } from '@/lib/jwt';
import { resetLinkTemplate } from '@/mails/resetLink';
import { logger } from '@/lib/winston';
import config from '@/config';
import nodemailerTransporter from '@/lib/nodemailer';

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
    // Generate a password reset token for the provided email
    const passwordResetToken = generatePasswordResetToken({ email });

    // Find the user by email and select the name and passwordResetToken fields
    const user = await User.findOne({ email }).select('name').exec();

    // If the user is not found, return a 404 status code
    if (!user) return;

    // Verify the nodemailer transporter to ensure it's ready to send emails
    await nodemailerTransporter.verify();

    // Send the reset token to user email
    await nodemailerTransporter.sendMail({
      from: `"Shortly" <test@andreiabernardo.com.br>`,
      to: email,
      subject: 'Password Reset Request',
      html: resetLinkTemplate({
        name: user.name,
        resetLink: `${config.CLIENT_ORIGIN}/reset-password?token=${passwordResetToken}`,
      }),
    });

    console.log(`Password reset email sent to ${email}`);

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
