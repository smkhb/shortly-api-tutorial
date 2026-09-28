/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Generate custom mongoose id
 */
export const generateMongooseId = () => new mongoose.Types.ObjectId();

/**
 * Generate backHalf
 */
export const generateBackHalf = (length: number = 5) => {
  const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let backHalf = '';

  for (let i = 0; i < length; i++) {
    backHalf += char[Math.floor(Math.random() * char.length)];
  }

  return backHalf;
};
