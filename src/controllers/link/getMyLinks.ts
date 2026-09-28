/**
 * Custom modules
 */
import { logger } from '@/lib/winston';
import { generateNextPageUrl, generatePrevPageUrl } from '@/utils';

/**
 * Models
 */
import Link from '@/models/link';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { RequestQuery, LinkField } from '@/types';
import type { SortOrder } from 'mongoose';

const getMyLinks = async (req: Request, res: Response): Promise<void> => {
  // Retrieve the userId from request object
  const userId = req.userId;

  // Retrieve queries from request body
  const {
    search = '',
    sortby = 'createdAt_desc',
    offset = 0,
    limit = 100,
  } = req.query as RequestQuery;

  // Regex for search in DB
  const searchRegex = new RegExp(`\\b${search}\\b`, 'gi');

  // Split sortby into field and order (e.g., 'createdAt_desc' => ['createdAt', 'desc'])
  const [sortField, sortOrder] = sortby.split('_') as [LinkField, SortOrder];

  try {
    // Query the link collection:
    // - Filter by title using the search regex
    // - Sort based on the specified field and order
    // - Apply lean() for better performance by returning plain JavaScript objects
    const link = await Link.find({ creator: userId })
      .where('title', searchRegex)
      .sort({ [sortField]: sortOrder })
      .select('-__v')
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();

    // Count total number of document that match the search criteria
    const total = await Link.countDocuments({ creator: userId })
      .where('title', searchRegex)
      .exec();

    // Generate the next page link for pagination
    const nextLink = generateNextPageUrl({
      baseUrl: req.baseUrl + req.path,
      search,
      sortby,
      offset: Number(offset),
      limit: Number(limit),
      total,
    });

    // Generate the previous page link for pagination
    const prevLink = generatePrevPageUrl({
      baseUrl: req.baseUrl + req.path,
      search,
      sortby,
      offset: Number(offset),
      limit: Number(limit),
    });

    // Send the response with the fetched links and pagination info
    res.status(200).json({
      code: 'LINKS_FETCHED',
      message: 'Links fetched successfully',
      data: {
        total,
        offset: Number(offset),
        limit: Number(limit),
        next: nextLink,
        prev: prevLink,
        links: link,
      },
    });
  } catch (error) {
    // Handle any unexpected errors that may occur during the link creation process
    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: "An error occurred while fetching the user's links",
    });

    // Log the error for debugging purposes
    logger.error(`An error occurred during getting user's links: ${error}`);
    return;
  }
};

export default getMyLinks;
