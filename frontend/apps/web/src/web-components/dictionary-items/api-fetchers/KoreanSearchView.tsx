import { useCallAPIWeb } from "../../../shared-web-hooks/useCallAPIWeb";
import { ResultCountMessage } from "../api-result-formatters/paginated-results/ResultsMessages";
import { PageChanger } from "../api-result-formatters/paginated-results/PageChanger";
import { KoreanSearchConfig } from "@repo/shared/types/views/searchConfigTypes";
import { isKoreanSearchResultType } from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useKoreanSearchResultListenerHandler } from "@repo/shared/hooks/listener-handlers/viewSpecificListenerHandlers";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { PaginatedResultsFormatter } from "../api-result-formatters/paginated-results/PaginatedResultsFormatter";
import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import { KoreanSearchResult } from "../item-components/korean/KoreanSearchResult";
import { memo } from "react";

export const KoreanSearchView = memo(
  ({ searchConfig }: { searchConfig: KoreanSearchConfig }) => {
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

    useKoreanSearchResultListenerHandler({
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
  }
);
