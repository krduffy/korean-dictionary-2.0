import { useEffect } from "react";
import { UseCallAPIReturns } from "../../types/apiCallTypes";
import { useDebounce } from "../useDebounce";
import { useShowFallback } from "../useShowFallback";
import { FALLBACK_MAX_TIME_MS, FALLBACK_MIN_TIME_MS } from "../../constants";

/* purpose of this will be to have the wrapper that allows for auto reloading when the user
   adds or changes something in the other panel */

export const useFetchProps = ({
  url,
  useCallAPIInstance,
  refetchDependencyArray = [],
}: {
  url: string;
  useCallAPIInstance: UseCallAPIReturns;
  refetchDependencyArray?: any[];
}) => {
  const { requestState, callAPI } = useCallAPIInstance;

  const debouncedCallAPI = useDebounce(() => {
    callAPI(url);
  });

  const doFetch = () => {
    debouncedCallAPI();
  };

  useEffect(() => {
    doFetch();
  }, refetchDependencyArray);

  return {
    requestState,
    refetch: doFetch,
  };
};
