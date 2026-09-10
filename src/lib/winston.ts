/**
 * Node modules
 *
 */
import { createLogger, format, transports, transport } from 'winston';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';

/**
 * Custom modules
 */
import config from '@/config';

// Intialize an array to hold all configured Winston transports
const transportation: transport[] = [];

// Throw error when source token or ingesting host is missing
if (!config.LOGTAIL_SOURCE_TOKEN || !config.LOGTAIL_INGESTING_HOST) {
  throw new Error('Logtail source token or ingesting host is missing!');
}

// Create a Logtai; instance for sending structured logs to a remote logging service
const logtail = new Logtail(config.LOGTAIL_SOURCE_TOKEN, {
  endpoint: config.LOGTAIL_INGESTING_HOST,
});

// In production environment, push LogtailTransport to winston transports
if (config.NODE_ENV === 'production') {
  transportation.push(new LogtailTransport(logtail));
}

// Destructure logging format utilities from Winston
const { colorize, combine, timestamp, label, printf } = format;

// In development environment, use console logging for real-time feedback
if (config.NODE_ENV === 'development') {
  transportation.push(
    new transports.Console({
      format: combine(
        colorize({ all: true }),
        label(),
        timestamp({ format: 'DD MMMM HH:mm:ss A' }),
        printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
    }),
  );
}

// Create a winston logger with the selected transports
const logger = createLogger({
  transports: transportation,
});

export { logtail, logger };
