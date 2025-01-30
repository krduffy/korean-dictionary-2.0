import { useEffect } from "react";
import {
  APIResponseType,
  isGeneralPaginatedResultsResponse,
} from "../../types/apiCallTypes";
import { API_PAGE_SIZE } from "../../constants";

/**
 * Calls a callback function when there is a redirect due to an out of bounds
 * page value. For when there is a likelihood that the number of pages can
 * before the user switches the page to a number out of bounds.
 */
export const useRedirectingPaginatedResults = ({
  response,
  requestedPage,
  onRedirect,
}: {
  response: APIResponseType;
  requestedPage: number;
  // eslint-disable-next-line no-unused-vars
  onRedirect: (pageNumRedirectedTo: number) => void;
}) => {
  /* attempts to mirror the logic for how the redirecting paginated
     list is done on the server rather than actually detect a redirect */
  useEffect(() => {
    if (!isGeneralPaginatedResultsResponse(response)) return;

    const maxPage = Math.ceil(response.count / API_PAGE_SIZE);

    if (requestedPage > maxPage) onRedirect(maxPage);
    if (requestedPage < 0) onRedirect(0);
  }, [response, requestedPage]);
};
