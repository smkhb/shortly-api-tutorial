/**
 * Node modules
 */
import bcrypt from 'bcrypt';

/**
 * Custom modules
 */
import { verifyPasswordResetToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import config from '@/config';
import nodemailerTransporter from '@/lib/nodemailer';
import { passwordResetTemplate } from '@/mails/passwordResetInfo';

/**
 * Models
 */
import User from '@/models/user';

/**
 * Types
 */
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import type { Request, Response } from 'express';
import type { ResetLinkPayload } from '@/lib/jwt';
import type { IUser } from '@/models/user';

type RequestBody = Pick<IUser, 'password'>;
type RequestQuery = { token: string };

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { password } = req.body as RequestBody;
  const { token } = req.query as RequestQuery;

  try {
    const { email } = verifyPasswordResetToken(token) as ResetLinkPayload;

    const user = await User.findOne({ email })
      .select('password name passwordResetToken')
      .exec();

    // Handle case when the user doesn't exist
    if (!user) return;

    // Handle case when the token doesn't exist in user model
    if (!user.passwordResetToken) {
      res.status(404).json({
        code: 'RESET_TOKEN_INVALID',
        message: 'Reset token is invalid',
      });
      return;
    }

    // Salt and hash the new password before saving it to the database
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password and clear the passwordResetToken
    user.password = hashedPassword;
    user.passwordResetToken = null;
    await user.save();

    // Response with a 204 success status
    res.status(204).json({
      code: 'PASSWORD_RESET_SUCCESS',
      message: 'Password has been reset successfully',
    });

    // Verify the nodemailer transporter to ensure it's ready to send emails
    await nodemailerTransporter.verify();

    // Send a confirmation email to the user
    await nodemailerTransporter.sendMail({
      from: `"Shortly" <test@andreiabernardo.com.br>`,
      to: email,
      subject: 'Password Reset Confirmation',
      html: passwordResetTemplate({
        name: user.name,
        supportLink: `${config.CLIENT_ORIGIN}/support`,
      }),
    });
    
    console.log(`Password reset confirmation email sent to ${email}`);

  } catch (error) {
    // Handle case when refreshToken expired
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'RESET_TOKEN_EXPIRED',
        message: 'Reset token has expired',
      });
      return;
    }

    // Handle case when refreshToken is invalid
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'RESET_TOKEN_INVALID',
        message: 'Reset token is invalid',
      });
      return;
    }
    // Response with a 500 status code for unexpected server errors
    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred while resetting the password',
    });
    logger.error('Unexpected error during password reset', {
      error,
    });
  }
};

export default resetPassword;
