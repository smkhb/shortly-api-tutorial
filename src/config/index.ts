import dotenv from 'dotenv';

dotenv.config();

/**
 * Constansts
 * @description This section defines constants used in the application, including the CORS whitelist, which is derived from an environment variable.
 */
const CORS_WHITELIST = ['https://shortly.codewithsadee.com'];
const _1H_IN_MS = 60 * 60 * 1000; // 1 hour in milliseconds

const config = {
  LOGTAIL_INGESTING_HOST: process.env.LOGTAIL_INGESTING_HOST!,
  LOGTAIL_SOURCE_TOKEN: process.env.LOGTAIL_SOURCE_TOKEN!,
  NODE_ENV: process.env.NODE_ENV!,
  PORT: process.env.PORT!,
  CORS_WHITELIST,
  WINDOW_MS: _1H_IN_MS,
  MONGO_CONNECTION_URI: process.env.MONGO_CONNECTION_URI!,
};

export default config;
