/**
 * @copyright 2025 smkhb
 * @license Apache-2.0
 */

/**
 * Node modules
 * @description This section imports built-in Node.js modules and third-party libraries used in the application.
 */
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

/**
 * Custom modules
 * @description This section imports custom modules used in the application.
 */
import config from '@/config';
import corsOptions from '@/lib/cors';
import { logger, logtail } from '@/lib/winston';
import { connectDB, disconnectDB } from '@/lib/mongoose';

/**
 * Routes
 * @description This section imports the application's route definitions, which handle incoming HTTP requests and define the API endpoints.
 */
import router from '@/routes';

/**
 * Initial express
 * @description This section initializes the Express application and sets up middleware for security, cookie parsing, and response compression.
 */
const server = express();

/**
 * use cors
 * @description This middleware enables Cross-Origin Resource Sharing (CORS) for the application, allowing it to handle requests from different origins based on the defined CORS options.
 */
server.use(cors(corsOptions));

/**
 * Secure Headers
 * @description This middleware sets various security-related HTTP headers to help protect the application.
 */
server.use(helmet());

/**
 * Parse JSON request bodies
 * @description This middleware parses incoming JSON request bodies and makes the data available under req.body.
 */
server.use(express.json());

/**
 * Parse URL-encoded request bodies
 * @description This middleware parses incoming URL-encoded request bodies and makes the data available under req.body.
 */
server.use(express.urlencoded({ extended: true }));

/**
 * Set the public folder
 * @description This middleware serves static files from the public directory, allowing clients to access resources like images, stylesheets, and scripts.
 */
server.use(express.static(`${__dirname}/public`));

/**
 * Parse cookies
 * @description This middleware parses cookies attached to the client request object and makes them available under req.cookies.
 */
server.use(cookieParser());

/**
 * Compress responses
 * @description This middleware compresses response bodies for all requests that traverse through the middleware, improving performance.
 */
server.use(compression());

// Imediately Invoked Function Expression (IIFE) to start the server
(async function (): Promise<void> {
  try {
    // Connect to the MongoDB database
    await connectDB();

    // Register application routes under the root path
    server.use('/', router);

    // Start the server and listen on the specified port
    server.listen(config.PORT, () => {
      logger.info(`Server is running on port ${config.PORT}`);
    });
  } catch (error) {
    // Log a critical error if the server fails to start
    logger.error('Failed to start server:', error);

    if (config.NODE_ENV === 'production') {
      // In production, exit the process with a failure code
      process.exit(1);
    }
  }
})();

// Handless graceful server shutdown on termination signals (e.g., SIGINT, SIGTERM)
const serverTermination = async (signal: NodeJS.Signals): Promise<void> => {
  try {
    // Disconnect from the MongoDB database
    await disconnectDB();

    // Log a warning indicating the server is shutting down
    logger.info('Server shutdown', signal);

    // Flush any remaining logs to Logtail before exiting
    logtail.flush();

    // Exit the process with a success code
    process.exit(0);
  } catch (error) {
    logger.error('Error during server shutdown:', error);
    process.exit(1);
  }
};

//
process.on('SIGTERM', serverTermination);
process.on('SIGINT', serverTermination);
