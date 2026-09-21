/**
 * Node modules
 */
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

/**
 * Custom modules
 */
import { verifyRefreshToken, generateAccessToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { TokenPayload } from '@/lib/jwt';

const refreshToken = async (req: Request, res: Response): Promise<void> => {
  // Retrieve the refreshToken from cookies
  const { refreshToken } = req.cookies;

  // Handle case when refreshToken is missing
  if (!refreshToken) {
    res.status(401).json({
      code: 'REFRESH_TOKEN_MISSING',
      message: 'Refresh token is missing',
    });
    return;
  }

  try {
    // Get the payload  data after verifying the refreshToken
    const { userId } = verifyRefreshToken(refreshToken) as TokenPayload;

    res.status(200).json({
      code: 'REFRESH_TOKEN_VALID',
      message: 'Refresh token is valid',
      data: {
        accessToken: generateAccessToken({ userId }),
      },
    });
  } catch (error) {
    // Handle case when refreshToken expired
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'REFRESH_TOKEN_EXPIRED',
        message: 'Refresh token has expired',
      });
      return;
    }

    // Handle case when refreshToken is invalid
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'REFRESH_TOKEN_INVALID',
        message: 'Refresh token is invalid',
      });
      return;
    }
    // Response with a 500 status code for unexpected server errors
    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred while refreshing the token',
    });
    logger.error('Unexpected error during token refresh', {
      error,
    });
  }
};

export default refreshToken;
