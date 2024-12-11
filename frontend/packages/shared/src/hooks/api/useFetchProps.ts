import { useEffect } from "react";
import { UseCallAPIReturns } from "../../types/apiCallTypes";
import { useDebounce } from "../useDebounce";
import { useShowFallback } from "../useShowFallback";
import { FALLBACK_MAX_TIME_MS, FALLBACK_MIN_TIME_MS } from "../../constants";

/* purpose of this will be to have the wrapper that allows for auto reloading when the user
   adds or changes something in the other panel */

export const useFetchProps = ({
  url,
  useAPICallInstance,
  refetchDependencyArray = [],
}: {
  url: string;
  useAPICallInstance: UseCallAPIReturns;
  refetchDependencyArray?: any[];
}) => {
  const { successful, error, loading, response, callAPI } = useAPICallInstance;

  const { showFallback, resetFallbackTimers } = useShowFallback({
    earlyCanceller: successful,
    fallbackMinTimeMs: FALLBACK_MIN_TIME_MS,
    fallbackMaxTimeMs: FALLBACK_MAX_TIME_MS,
  });

  const debouncedCallAPI = useDebounce(() => {
    callAPI(url);
  });

  useEffect(() => {
    resetFallbackTimers();
    debouncedCallAPI();
    /* DEPENDENCY ARRAY WILL NEED TO CHANGE SO THAT WHEN USER LOGS IN ETC THE APP KNOWS
       IF THE CURRENT VIEW NEEDS TO BE UPDATED!!!!!!!! */
  }, refetchDependencyArray);

  return {
    successful,
    error,
    loading: loading || showFallback,
    response,
  };
};
