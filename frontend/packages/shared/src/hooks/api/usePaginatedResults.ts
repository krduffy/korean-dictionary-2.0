import { useEffect, useRef, useState } from "react";

import { APIResponseType, UseCallAPIReturns } from "../../types/apiCallTypes";
import { useSpamProtectedSetter } from "../useSpamProtectedSetter";
import { FALLBACK_MAX_TIME_MS, FALLBACK_MIN_TIME_MS } from "../../constants";
import { useShowFallback } from "../useShowFallback";

interface UsePaginatedResultsArgs {
  baseUrl: string;
  useCallAPIInstance: UseCallAPIReturns;
  scrollToOnPageChange?: React.RefObject<HTMLInputElement>;
}

interface UsePaginatedResultsReturns {
  searchResults: APIResponseType;
  refetch: () => void;
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

  const { showFallback, resetFallbackTimers } = useShowFallback({
    earlyCanceller: successful,
    fallbackMinTimeMs: FALLBACK_MIN_TIME_MS,
    fallbackMaxTimeMs: FALLBACK_MAX_TIME_MS,
  });

  // eslint-disable-next-line no-unused-vars
  const hasInteractedRef = useRef(false);

  const asyncGetResults = async () => {
    return await callAPI(baseUrl);
  };

  const updateSearchResults = useSpamProtectedSetter<APIResponseType>({
    dataGetter: asyncGetResults,
    setter: setSearchResults,
  });

  const doFetch = () => {
    resetFallbackTimers();
    updateSearchResults();
  };

  useEffect(() => {
    doFetch();
  }, [baseUrl]);

  return {
    searchResults,
    refetch: doFetch,
    loading: loading || showFallback,
    successful,
    error,
    response,
  };
};
