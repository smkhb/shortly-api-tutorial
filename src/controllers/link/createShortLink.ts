/**
 * Custom modules
 */
import { logger } from '@/lib/winston';
import config from '@/config';
import { generateBackHalf } from '@/utils';

/**
 * Models
 */
import Link from '@/models/link';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { ILink } from '@/models/link';
type RequestBody = Pick<ILink, 'title' | 'destination' | 'backHalf'>;

const createShortLink = async (req: Request, res: Response) => {
  // Get the userId from request
  const userId = req.userId;

  // Get the link from request
  const {
    title,
    destination,
    backHalf = generateBackHalf(),
  }: RequestBody = req.body;

  try {
    // Insert a new link into the database
    const link = await Link.create({
      title,
      destination,
      backHalf,
      shortLink: `${config.CLIENT_ORIGIN}/${backHalf}`,
      creator: userId,
    });

    // Send a success response with the created link
    res.status(201).json({
      code: 'LINK_CREATED',
      message: 'Link created successfully',
      data: link,
    });
  } catch (error) {
    // Handle any unexpected errors that may occur during the link creation process
    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred while registering the user',
    });

    // Log the error for debugging purposes
    logger.error(`An error occurred during link creation: ${error}`);
    return;
  }
};

export default createShortLink;
