import dotenv from 'dotenv';

dotenv.config();

/**
 * Constansts
 * @description This section defines constants used in the application, including the CORS whitelist, which is derived from an environment variable.
 */
const CORS_WHITELIST = ['https://shortly.codewithsadee.com'];
const _1H_IN_MS = 60 * 60 * 1000; // 1 hour in milliseconds
const _7D_IN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const config = {
  LOGTAIL_INGESTING_HOST: process.env.LOGTAIL_INGESTING_HOST!,
  LOGTAIL_SOURCE_TOKEN: process.env.LOGTAIL_SOURCE_TOKEN!,
  NODE_ENV: process.env.NODE_ENV!,
  PORT: process.env.PORT!,
  CORS_WHITELIST,
  WINDOW_MS: _1H_IN_MS,
  COOKIE_MAX_AGE: _7D_IN_MS,
  MONGO_CONNECTION_URI: process.env.MONGO_CONNECTION_URI!,
  WHITELISTED_EMAILS: process.env.WHITELISTED_EMAILS?.split(','),
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_PASSWORD_RESET_SECRET: process.env.JWT_PASSWORD_RESET_SECRET!,
  SMTP_USER: process.env.SMTP_USER!,
  SMTP_PASS: process.env.SMTP_PASSWORD!,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN!,
};

export default config;
