/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Custom modules
 */
import config from '@/config';
import { logger } from '@/lib/winston';

/**
 * Types
 */
import type { ConnectOptions } from 'mongoose';

/**
 * Mongo connection options
 */
const connectionOption: ConnectOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
  dbName: 'shortly-tutorial',
};

/**
 * Connect to MongoDB
 * @description Verfies that the mongoDB connection string exists in the configuration.
 * - Attempts to connect using the provided connection options.
 * - Logs a success message if the connection is established.
 * - Catches and logs any connection errors,
 * @throws Error if the MongoDB connection string is missing in hte configuration
 */
const connectDB = async (): Promise<void> => {
  // Handle case when connection stringdoes not exist.
  if (!config.MONGO_CONNECTION_URI) {
    throw new Error('Mongo URI is missing.');
  }
  try {
    await mongoose.connect(config.MONGO_CONNECTION_URI, connectionOption);
    logger.info('MongoDB connection established successfully.');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
  }
};

/**
 * Gracefully disconnect from MongoDB
 * @description Uses Mongoose to terminate the active database connection.
 * - Catches and logs any errors that occur during disconnection.
 * @throws Error if there is an issue during the disconnection process
 */
const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected successfully.');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
  }
};

export { connectDB, disconnectDB };
