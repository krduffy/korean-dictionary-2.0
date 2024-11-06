import { useEffect, useRef, useState } from "react";

import { UseCallAPIReturns } from "your-package/types/apiCallTypes";
import { useSpamProtectedSetter } from "./useSpamProtectedSetter";
import { useDebounce } from "./useDebounce";

interface UsePaginatedResultsArgs {
  baseUrl: string;
  initialPage: number;
  useCallAPIInstance: UseCallAPIReturns;
  scrollToOnPageChange?: React.RefObject<HTMLInputElement>;
}

interface UsePaginatedResultsReturns {
  currentPage: number;
  // eslint-disable-next-line no-unused-vars
  setCurrentPage: (newValue: number) => void;
  searchResults: any;
  loading: boolean;
  successful: boolean;
  error: boolean;
  response: any;
}

export const usePaginatedResults = ({
  baseUrl,
  initialPage = 1,
  useCallAPIInstance,
  // eslint-disable-next-line no-unused-vars
  scrollToOnPageChange,
}: UsePaginatedResultsArgs): UsePaginatedResultsReturns => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchResults, setSearchResults] = useState({});
  const { successful, error, loading, response, callAPI } = useCallAPIInstance;

  // eslint-disable-next-line no-unused-vars
  const hasInteractedRef = useRef(false);

  const asyncGetResults = async () => {
    const hasParams = baseUrl.includes("?");
    const apiUrl = baseUrl + (hasParams ? "&" : "?") + `page=${currentPage}`;
    const data = await callAPI(apiUrl);
    return data;
  };

  const updateSearchResults = useDebounce(
    useSpamProtectedSetter({
      dataGetter: asyncGetResults,
      setter: setSearchResults,
    })
  );

  useEffect(() => {
    updateSearchResults();
  }, [currentPage, baseUrl]);

  useEffect(() => {
    if (initialPage !== currentPage) {
      setCurrentPage(initialPage);
    } else {
      updateSearchResults();
    }
  }, [initialPage]);

  useEffect(() => {
    if (currentPage !== initialPage) {
      updateSearchResults();
    }
  }, [currentPage]);

  return {
    currentPage,
    setCurrentPage,
    searchResults,
    loading,
    successful,
    error,
    response,
  };
};
