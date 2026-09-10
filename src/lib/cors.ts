/**
 * Custom modules
 */

import config from '@/config';

/**
 * Types
 * @description This section imports type definitions used in the application, specifically the CorsOptions type from the 'cors' library, which defines the shape of the CORS configuration object.
 */

import type { CorsOptions } from 'cors';

// CORS configuration options
const corsOptions: CorsOptions = {
  // Custom origin validation function
  origin(requestOrigin, callback) {
    // Allow the request if the origin is in the whitelist
    if (requestOrigin && config.CORS_WHITELIST.includes(requestOrigin)) {
      callback(null, true); // Allow the request if the origin is in the whitelist
    } else {
      // In development allow all origins; other, block with an error
      callback(
        config.NODE_ENV === 'development'
          ? null
          : new Error('Not allowed by CORS'),
      );
    }
  },
};

export default corsOptions;
