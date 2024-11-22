import { useEffect, useRef, useState } from "react";

import { APIResponseType, UseCallAPIReturns } from "../types/apiCallTypes";
import { useSpamProtectedSetter } from "./useSpamProtectedSetter";

interface UsePaginatedResultsArgs {
  baseUrl: string;
  useCallAPIInstance: UseCallAPIReturns;
  scrollToOnPageChange?: React.RefObject<HTMLInputElement>;
}

interface UsePaginatedResultsReturns {
  searchResults: APIResponseType;
  loading: boolean;
  successful: boolean;
  error: boolean;
  response: APIResponseType;
}

export const usePaginatedResults = ({
  baseUrl,
  useCallAPIInstance,
  // eslint-disable-next-line no-unused-vars
  scrollToOnPageChange,
}: UsePaginatedResultsArgs): UsePaginatedResultsReturns => {
  const [searchResults, setSearchResults] = useState<APIResponseType>({});
  const { successful, error, loading, response, callAPI } = useCallAPIInstance;

  // eslint-disable-next-line no-unused-vars
  const hasInteractedRef = useRef(false);

  const asyncGetResults = async () => {
    return await callAPI(baseUrl);
  };

  const updateSearchResults = useSpamProtectedSetter<APIResponseType>({
    dataGetter: asyncGetResults,
    setter: setSearchResults,
  });

  useEffect(() => {
    updateSearchResults();
  }, [baseUrl]);

  return {
    searchResults,
    loading,
    successful,
    error,
    response,
  };
};
