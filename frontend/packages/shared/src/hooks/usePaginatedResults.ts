import { useEffect, useRef, useState } from "react";

import { UseCallAPIReturns } from "your-package/types/apiCallTypes";
import { useSpamProtectedSetter } from "./useSpamProtectedSetter";
import { useDebounce } from "./useDebounce";

interface UsePaginatedResultsArgs {
  baseUrl: string;
  useCallAPIInstance: UseCallAPIReturns;
  scrollToOnPageChange?: React.RefObject<HTMLInputElement>;
}

interface UsePaginatedResultsReturns {
  searchResults: any;
  loading: boolean;
  successful: boolean;
  error: boolean;
  response: any;
}

export const usePaginatedResults = ({
  baseUrl,
  useCallAPIInstance,
  // eslint-disable-next-line no-unused-vars
  scrollToOnPageChange,
}: UsePaginatedResultsArgs): UsePaginatedResultsReturns => {
  const [searchResults, setSearchResults] = useState({});
  const { successful, error, loading, response, callAPI } = useCallAPIInstance;

  // eslint-disable-next-line no-unused-vars
  const hasInteractedRef = useRef(false);

  const asyncGetResults = async () => {
    return await callAPI(baseUrl);
  };

  const updateSearchResults = useDebounce(
    useSpamProtectedSetter({
      dataGetter: asyncGetResults,
      setter: setSearchResults,
    })
  );

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
