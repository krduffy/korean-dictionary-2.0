import { useCallAPI } from "@repo/shared/hooks/useCallAPI";
import { tokenHandlers } from "./tokenHandlers";
import { useCachingContext } from "@repo/shared/contexts/CachingContextProvider";

export const useCallAPIWeb = ({ cacheResults }: { cacheResults: boolean }) => {
  const cacheFunctions = useCachingContext();

  const onCaughtError = () => {
    console.warn("error");
  };

  return useCallAPI({
    tokenHandlers,
    cacheResults,
    cacheFunctions,
    onCaughtError,
  });
};
