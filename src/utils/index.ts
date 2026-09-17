/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Generate custom mongoose id
 */
export const generateMongooseId = () => new mongoose.Types.ObjectId();