// Declaring type for getMyLinks request queries
export type RequestQuery = {
  search?: string;
  sortby?: string;
  filter?: string;
  offset?: number;
  limit?: number;
};

// Declaring the type for LinkField for getMyLinks route
export type LinkField = 'title' | 'destination' | 'createdAt';

// The type of generateNextLink & generatePrevLink
export type GenLinkProps = {
  baseUrl: string;
  search?: string;
  sortby?: string;
  offset: number;
  limit: number;
  total: number;
};
