import dotenv from 'dotenv';

dotenv.config();

/**
 * Constansts
 * @description This section defines constants used in the application, including the CORS whitelist, which is derived from an environment variable.
 */
const CORS_WHITELIST = ['https://shortly.codewithsadee.com'];

const config = {
  PORT: process.env.PORT!,
  NODE_ENV: process.env.NODE_ENV!,
  CORS_WHITELIST,
};

export default config;
