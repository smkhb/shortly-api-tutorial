/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Models
 */
import Link from '@/models/link';
import User from '@/models/user';

/**
 * Types
 */
import type { Request, Response } from 'express';

const redirect = async (req: Request, res: Response) => {
  const { backHalf } = req.params;

  try {
    // Check this backHalf matches any link in the DB
    const backHalfExists = await Link.exists({ backHalf }).exec();

    // If the link does not exist, return a 404 Not Found response
    if (!backHalfExists) {
      res.status(404).json({
        code: 'LINK_NOT_FOUND',
        message: 'The link with the given back half does not exist',
      });
      return;
    }

    // Retrieve the destination URL from the database
    const link = await Link.findById(backHalfExists._id)
      .select('destination creator totalVisitCount  ')
      .exec();

    // return if link doesn't found
    if (!link) return;

    // Increment the total visit count for the link
    link.totalVisitCount++;
    await link.save();

    // Update the user's total visit count
    const user = await User.findById(link.creator)
      .select('totalVisitCount')
      .exec();

    // return if user doesn't found
    if (!user) return;

    user.totalVisitCount++;
    await user.save();

    // Redirect to destination URL
    res.redirect(
      link.destination.startsWith('https://')
        ? link.destination
        : `https://${link.destination}`,
    );
  } catch (error) {
    // Handle any unexpected errors that may occur during the redirect process
    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message:
        'An error occurred while redirecting the user to the original URL',
    });

    // Log the error for debugging purposes
    logger.error(`An error occurred during redirect: ${error}`);
    return;
  }
};

export default redirect;
