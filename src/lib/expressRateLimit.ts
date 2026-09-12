/**
 * Node modules
 */
import { rateLimit } from 'express-rate-limit';

/**
 * Custom modules
 */
import config from '@/config';

/**
 * Types
 */
import type { RateLimitRequestHandler, Options } from 'express-rate-limit';
type RateLimitType = 'basic' | 'auth' | 'passReset';

// Default rate limit configuration applied for all types
const defaultLimitOpt: Partial<Options> = {
  windowMs: config.WINDOW_MS, // Time window in milliseconds (1 hour)
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  standardHeaders: true, // Enable the standard `RateLimit-*` headers
};

// Map holding specific rate limit options based on type
const rateLimitOpt = new Map<RateLimitType, Partial<Options>>([
  ['basic', { ...defaultLimitOpt, limit: 100 }], // Basic limit: 100 requests per hour for general endpoints
  ['auth', { ...defaultLimitOpt, limit: 10 }], // Auth limit: 10 requests per hour for authentication endpoints
  ['passReset', { ...defaultLimitOpt, limit: 3 }], // Password reset limit: 3 requests per hour for password reset endpoints
]);

// Function to get rate limit middleware based on type
const expressRateLimit = (type: RateLimitType): RateLimitRequestHandler => {
  return rateLimit(rateLimitOpt.get(type)); // Retrieve config from map and return middleware
};

export default expressRateLimit;
