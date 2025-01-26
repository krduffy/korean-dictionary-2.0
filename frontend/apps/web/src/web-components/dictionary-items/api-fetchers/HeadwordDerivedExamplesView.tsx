import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../shared-web-hooks/useCallAPIWeb";
import { ResultCountMessage } from "../api-result-formatters/paginated-results/ResultsMessages";
import { PaginatedResultsFormatter } from "../api-result-formatters/paginated-results/PaginatedResultsFormatter";
import { PageChanger } from "../api-result-formatters/paginated-results/PageChanger";
import { isHeadwordDerivedExampleSearchResultType } from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { HeadwordDerivedExampleSearchResult } from "../item-components/korean/detail/HeadwordDerivedExampleSearchResult";

export const HeadwordDerivedExamplesView = ({
  headwordPk,
  pageNum,
}: {
  headwordPk: number;
  pageNum: number;
}) => {
  const url = getEndpoint({
    endpoint: "get_derived_example_lemmas_search",
    queryParams: {
      headword_pk: headwordPk,
      page: pageNum,
    },
  });

  const { requestState } = useFetchProps({
    url: url,
    useCallAPIInstance: useCallAPIWeb({ cacheResults: true }),
    refetchDependencyArray: [url],
  });

  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  const handlePageChange = (newPage: number) => {
    panelDispatchStateChangeSelf({
      type: "update_korean_detail_interaction_data",
      key: "derivedLemmasPageNum",
      newValue: newPage,
    });
  };

  return (
    <>
      <ResultCountMessage
        pageNum={pageNum}
        responseCount={requestState?.response?.count}
      />

      <PaginatedResultsFormatter
        requestState={requestState}
        verifier={isHeadwordDerivedExampleSearchResultType}
        ResultComponent={HeadwordDerivedExampleSearchResult}
      />

      <PageChanger
        pageNum={pageNum}
        setPageNum={handlePageChange}
        responseCount={requestState?.response?.count}
      />
    </>
  );
};
