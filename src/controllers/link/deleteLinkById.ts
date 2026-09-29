/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Models
 */
import Link from '@/models/link';

/**
 * Types
 */
import type { Request, Response } from 'express';

const deleteLinkById = async (req: Request, res: Response) => {
  const { linkId } = req.params;
  const userId = req.userId;


  try {
    // Check if the link with give ID exists in the DB
    const isLinkAvailable = await Link.exists({ _id: linkId }).exec();

    // If the link does not exist, return a 404 Not Found response
    if (!isLinkAvailable) {
      res.status(404).json({
        code: 'LINK_NOT_FOUND',
        message: 'The link with the given ID does not exist',
      });
      return;
    }

    // Check requested user is owner of the link
    const isLinkOwner = await Link.exists({
      _id: linkId,
      creator: userId,
    }).exec();

    // If the user is not the owner of the link, return a 403 Forbidden response
    if (!isLinkOwner) {
      res.status(403).json({
        code: 'FORBIDDEN',
        message: 'You are not authorized to update this link',
      });
      return;
    }

    // Delete the link from the database
    await Link.deleteOne({ _id: linkId }).exec();

    res.status(200).json({
      code: 'LINK_DELETED',
      message: 'The link has been successfully deleted',
    });
  } catch (error) {
    // Handle any unexpected errors that may occur during the delete link process
    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: "An error occurred while deleting the user's link",
    });

    // Log the error for debugging purposes
    logger.error(`An error occurred during deleting user's link: ${error}`);
    return;
  }
};

export default deleteLinkById;
