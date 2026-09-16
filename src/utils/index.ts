/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Generate custom mongoose id
 */
export const generateMongooseId = (): mongoose.Types.ObjectId => {
  return new mongoose.Types.ObjectId();
};
