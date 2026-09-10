import dotenv from 'dotenv';

dotenv.config();

/**
 * Constansts
 * @description This section defines constants used in the application, including the CORS whitelist, which is derived from an environment variable.
 */
const CORS_WHITELIST = ['https://shortly.codewithsadee.com'];

const config = {
  LOGTAIL_INGESTING_HOST: process.env.LOGTAIL_INGESTING_HOST!,
  LOGTAIL_SOURCE_TOKEN: process.env.LOGTAIL_SOURCE_TOKEN!,
  NODE_ENV: process.env.NODE_ENV!,
  PORT: process.env.PORT!,
  CORS_WHITELIST,
};

export default config;
