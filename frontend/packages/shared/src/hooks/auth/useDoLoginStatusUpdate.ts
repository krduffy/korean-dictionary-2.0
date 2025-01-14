import { ApiEndpoint, getEndpoint } from "../../utils/apiAliases";
import { useCachingContext } from "../../contexts/CachingContextProvider";
import { useGlobalFunctionsContext } from "../../contexts/GlobalFunctionsContextProvider";
import { usePersistentDictionaryPageStateContext } from "../../contexts/PersistentDictionaryPageStateContext";

export const useDoLoginStatusUpdate = () => {
  const { keepOnlyUrlsWithOneOfSubstrings } = useCachingContext();
  const { globalEmit } = useGlobalFunctionsContext();

  const { leftPanelData, rightPanelData } =
    usePersistentDictionaryPageStateContext();
  const { panelEmitSelf: leftEmit } = leftPanelData;
  const { panelEmitSelf: rightEmit } = rightPanelData;

  const keptEndpointsAfterLogin: ApiEndpoint[] = ["find_lemma"];
  const keptSubstringsAfterLogin = keptEndpointsAfterLogin.map((endpoint) =>
    getEndpoint({ endpoint: endpoint })
  );

  const doLoginStatusUpdate = () => {
    keepOnlyUrlsWithOneOfSubstrings(keptSubstringsAfterLogin);

    globalEmit("NAVBAR", {
      eventType: "loadedDataChanged",
      passToCallback: undefined,
    });

    leftEmit("PANEL", {
      eventType: "loadedDataChanged",
      passToCallback: undefined,
    });
    rightEmit("PANEL", {
      eventType: "loadedDataChanged",
      passToCallback: undefined,
    });
  };

  return { doLoginStatusUpdate };
};
