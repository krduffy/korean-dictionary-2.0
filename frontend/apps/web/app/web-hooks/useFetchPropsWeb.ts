import { useCallAPIWeb } from "./useCallAPIWeb";

import { useFetchProps } from "@repo/shared/hooks/useFetchProps";

export const useFetchPropsWeb = ({ url }: { url: string }) => {
  return useFetchProps({
    invokedUseCallAPI: useCallAPIWeb({ url: url }).useCallAPIReturns,
  });
};
