/**
 * Node modules
 */
import jwt from 'jsonwebtoken';

/**
 * Custom modules
 */
import config from '@/config';

/**
 * Types
 */
import type { Types } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

export type TokenPayload = { userId: Types.ObjectId };
export type ResetLinkPayload = { email: string };

/**
 * Generate JWT access token with a 30-min expiration.
 * - Signs the provided payload using the configured access token secret.
 */
const generateAccessToken = (payload: TokenPayload): string => {
  const token = jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: '30m',
  });
  return token;
};

/**
 * Generate JWT refresh token with a 7 days expiration.
 * - Signs the provided payload using the configured refresh token secret.
 */
const generateRefreshToken = (payload: TokenPayload): string => {
  const token = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
  return token;
};

/**
 * Generate JWT reset password link with a 15-min expiration.
 * - Signs the provided payload using the configured reset password secret.
 */
const generatePasswordResetToken = (payload: ResetLinkPayload): string => {
  const token = jwt.sign(payload, config.JWT_PASSWORD_RESET_SECRET, {
    expiresIn: '15m',
  });
  return token;
};

/**
 * Verify accessToken
 */
const verifyAccessToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, config.JWT_ACCESS_SECRET);
};

/**
 * Verify refreshToken
 */
const verifyRefreshToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET);
};

/**
 * Verify reset password token
 */
const verifyPasswordResetToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, config.JWT_PASSWORD_RESET_SECRET);
};

export {
  generateAccessToken,
  generateRefreshToken,
  generatePasswordResetToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyPasswordResetToken,
};
