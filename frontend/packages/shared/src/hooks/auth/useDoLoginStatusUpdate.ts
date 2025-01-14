import { ApiEndpoint, getEndpoint } from "../../utils/apiAliases";
import { useCachingContext } from "../../contexts/CachingContextProvider";
import { useGlobalFunctionsContext } from "../../contexts/GlobalFunctionsContextProvider";

export const useDoLoginStatusUpdate = () => {
  const { keepOnlyUrlsWithOneOfSubstrings } = useCachingContext();
  const { globalEmit } = useGlobalFunctionsContext();

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
  };

  return { doLoginStatusUpdate };
};
