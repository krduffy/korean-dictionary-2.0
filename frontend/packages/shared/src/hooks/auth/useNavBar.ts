import { useEffect } from "react";
import { UseCallAPIReturns } from "../../types/apiCallTypes";
import { useFetchProps } from "../api/useFetchProps";
import { getEndpoint } from "../../utils/apiAliases";
import { useGlobalFunctionsContext } from "../../contexts/GlobalFunctionsContextProvider";
import { useLoginStatusContext } from "../../contexts/LoginStatusContextProvider";

export const useNavBar = ({
  useCallAPIInstance,
}: {
  useCallAPIInstance: UseCallAPIReturns;
}) => {
  const { globalSubscribe, globalUnsubscribe } = useGlobalFunctionsContext();
  const { setLoggedInAs } = useLoginStatusContext();

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

  useEffect(() => {
    if (
      requestState.progress === "success" &&
      requestState.response?.username
    ) {
      setLoggedInAs(String(requestState.response.username));
    } else {
      setLoggedInAs(null);
    }
  }, [requestState]);
};
