import { usePanelFunctionsContext } from "../../contexts/PanelFunctionsContextProvider";
import { useEffect } from "react";

/**
 * Responds to events from the `"PANEL"` pk, as opposed to a
 * Hanja char or a dictionary word pk.
 */
export const useGeneralPanelReloadListenerHandler = ({
  refetch,
}: {
  refetch: () => void;
}) => {
  const { panelSubscribeSelf, panelUnsubscribeSelf } =
    usePanelFunctionsContext();

  useEffect(() => {
    const listenerData = {
      eventType: "loadedDataChanged",
      onNotification: () => refetch(),
    } as const;

    panelSubscribeSelf("PANEL", listenerData);

    return () => panelUnsubscribeSelf("PANEL", listenerData);
  }, []);
};
