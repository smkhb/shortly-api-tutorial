/**
 * Node modules
 */

/**
 * Custom modules
 */
import { logger } from '@/lib/winston';
import { verifyAccessToken } from '@/lib/jwt';

/**
 * Types
 */
import type { Request, Response, NextFunction } from 'express';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { TokenPayload } from '@/lib/jwt';

const authentication = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Retrieve the access token from the request headers
  const { authorization } = req.headers;

  // Check if the access token is present
  if (!authorization) {
    res.status(401).json({
      code: 'ACCESS_TOKEN_MISSING',
      message: 'Access token is missing',
    });
    return;
  }

  // Retrieve only token from authorization header (Bearer <token>)
  const [_, accessToken] = authorization.split(' ');

  try {
    // Get the userId from jwt payload
    const { userId } = verifyAccessToken(accessToken) as TokenPayload;

    // Send the userId to the next middleware or controller
    req.userId = userId;

    next();
  } catch (error) {
    // Handle case when accessToken expired
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'ACCESS_TOKEN_EXPIRED',
        message: 'Access token has expired',
      });
      return;
    }

    // Handle case when accessToken is invalid
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'ACCESS_TOKEN_INVALID',
        message: 'Access token is invalid',
      });
      return;
    }

    // Handle any other unexpected errors
    logger.error('Unexpected error in authentication middleware', {
      error,
    });
    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    });
  }
};

export default authentication;
