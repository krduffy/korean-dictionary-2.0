import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../web-hooks/useCallAPIWeb";
import { HanjaSearchResult } from "../dictionary-page/dictionary-items/hanja/HanjaSearchResult";
import { ResultCountMessage } from "../dictionary-page/views/view-components/ResultsMessages";
import { PageChanger } from "../dictionary-page/views/view-components/PageChanger";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { HanjaSearchConfig } from "@repo/shared/types/views/searchConfigTypes";
import { isHanjaSearchResultType } from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";
import { useHanjaSearchResultListenerManager } from "@repo/shared/hooks/listener-handlers/useListenerHandlers";
import { PaginatedResultsFormatter } from "../api-data-formatters/PaginatedResultsFormatter";
import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";

type HanjaSearchData = {
  searchConfig: HanjaSearchConfig;
};

export const HanjaSearchView: React.FC<HanjaSearchData> = ({
  searchConfig,
}) => {
  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  const url = getEndpoint({
    endpoint: "search_hanja",
    queryParams: searchConfig,
  });

  const { requestState, refetch } = useFetchProps({
    url: url,
    useCallAPIInstance: useCallAPIWeb({ cacheResults: true }),
    refetchDependencyArray: [url],
  });

  useHanjaSearchResultListenerManager({
    url,
    response: requestState.response,
    refetch,
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
        verifier={isHanjaSearchResultType}
        ResultComponent={HanjaSearchResult}
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
