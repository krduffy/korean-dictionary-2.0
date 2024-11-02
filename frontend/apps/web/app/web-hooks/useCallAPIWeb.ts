import { useCallAPI } from "@repo/shared/hooks/useCallAPI";
import { allTokenHandlers } from "./tokenHandlers";

export const useCallAPIWeb = () => {
  const onRefreshFail = () => {
    alert("Your login has expired.");
    // go to homepage
  };

  const useCallAPIReturns = useCallAPI({
    tokenHandlers: allTokenHandlers,
    onRefreshFail: onRefreshFail,
    includeCredentials: false,
  });

  return {
    useCallAPIReturns: useCallAPIReturns,
    /* savetokens is directly from the file in this app */
    tokenHandlers: allTokenHandlers,
  };
};
