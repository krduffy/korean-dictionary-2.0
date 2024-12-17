import { useCallAPIWeb } from "../../web-hooks/useCallAPIWeb";
import { KoreanSearchResult } from "../dictionary-page/dictionary-items/korean/KoreanSearchResult";
import { ResultCountMessage } from "../dictionary-page/views/view-components/ResultsMessages";
import { PageChanger } from "../dictionary-page/views/view-components/PageChanger";
import { KoreanSearchConfig } from "@repo/shared/types/views/searchConfigTypes";
import { isKoreanSearchResultType } from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useKoreanSearchResultListenerManager } from "@repo/shared/hooks/listener-handlers/useListenerHandlers";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { PaginatedResultsFormatter } from "../api-data-formatters/PaginatedResultsFormatter";
import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";

export const KoreanSearchView = ({
  searchConfig,
}: {
  searchConfig: KoreanSearchConfig;
}) => {
  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  const url = getEndpoint({
    endpoint: "search_korean",
    queryParams: searchConfig,
  });

  const { requestState, refetch } = useFetchProps({
    url: url,
    useCallAPIInstance: useCallAPIWeb({ cacheResults: true }),
    refetchDependencyArray: [url],
  });

  useKoreanSearchResultListenerManager({
    url: url,
    response: requestState.response,
    refetch: refetch,
  });

  return (
    <>
      <ResultCountMessage
        pageNum={searchConfig.page}
        responseCount={requestState?.response?.count}
      />

      <PaginatedResultsFormatter
        requestState={requestState}
        searchTerm={searchConfig.search_term}
        verifier={isKoreanSearchResultType}
        ResultComponent={KoreanSearchResult}
      />

      <PageChanger
        pageNum={searchConfig.page}
        setPageNum={(newPage: number) =>
          panelDispatchStateChangeSelf({
            type: "update_page",
            newPage: newPage,
          })
        }
        responseCount={requestState?.response?.count}
      />
    </>
  );
};
