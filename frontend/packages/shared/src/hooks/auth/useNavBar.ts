import { useEffect } from "react";
import { UseCallAPIReturns } from "../../types/apiCallTypes";
import { useFetchProps } from "../api/useFetchProps";
import { getEndpoint } from "../../utils/apiAliases";
import { useGlobalFunctionsContext } from "../../contexts/GlobalFunctionsContextProvider";

export const useNavBar = ({
  useCallAPIInstance,
}: {
  useCallAPIInstance: UseCallAPIReturns;
}) => {
  const { globalSubscribe, globalUnsubscribe } = useGlobalFunctionsContext();

  useEffect(() => {
    const listenerData = {
      eventType: "loadedDataChanged",
      onNotification: () => refetch(),
    } as const;

    globalSubscribe("NAVBAR", listenerData);

    return () => globalUnsubscribe("NAVBAR", listenerData);
  }, []);

  /* needed to test if the user is logged in */
  const { requestState, refetch } = useFetchProps({
    url: getEndpoint({ endpoint: "user_info" }),
    useCallAPIInstance: useCallAPIInstance,
  });

  return { requestState };
};
