import { useEffect } from "react";
import { UseCallAPIReturns } from "../types/apiCallTypes";

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

  useEffect(() => {
    callAPI(url);
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
