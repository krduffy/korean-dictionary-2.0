import { useCallAPI } from "@repo/shared/hooks/useCallAPI";
import { allTokenHandlers } from "./tokenHandlers";

export const useCallAPIWeb = ({ url }: { url: string }) => {
  const onRefreshFail = () => {
    alert("Your login has expired.");
    // go to homepage
  };

  const useCallAPIReturns = useCallAPI({
    url: url,
    tokenHandlers: allTokenHandlers,
    onRefreshFail: onRefreshFail,
  });

  return {
    useCallAPIReturns: useCallAPIReturns,
    /* savetokens is directly from the file in this app */
    tokenHandlers: allTokenHandlers,
  };
};
