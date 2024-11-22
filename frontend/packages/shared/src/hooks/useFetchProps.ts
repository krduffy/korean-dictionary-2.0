import { useEffect } from "react";
import { UseCallAPIReturns } from "../types/apiCallTypes";
import { useDebounce } from "./useDebounce";

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

  const debouncedCallAPI = useDebounce(() => {
    callAPI(url);
  });

  useEffect(() => {
    debouncedCallAPI();
    /* DEPENDENCY ARRAY WILL NEED TO CHANGE SO THAT WHEN USER LOGS IN ETC THE APP KNOWS
       IF THE CURRENT VIEW NEEDS TO BE UPDATED!!!!!!!! */
  }, refetchDependencyArray);

  return {
    successful,
    error,
    loading,
    response,
  };
};
