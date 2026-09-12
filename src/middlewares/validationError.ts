/**
 * Node modules
 */
import { validationResult } from 'express-validator';

/**
 * Types
 */
import type { Request, Response, NextFunction } from 'express';

/**
 * Express middleware to handle validation errors
 * @description – Uses 'express-validator' to check for validation results. If validation errors are present, responds with HTTP 400 and JSON object containing error details. If no validation errors exist, forwards the request to the next middleware.
 */

const validationError = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors: errors.mapped(),
    });
    return;
  }

  next();
};

export default validationError;
