import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { PageChanger } from "../api-result-formatters/paginated-results/PageChanger";
import { ResultCountMessage } from "../api-result-formatters/paginated-results/ResultsMessages";
import { useCallAPIWeb } from "../../../shared-web-hooks/useCallAPIWeb";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { isHanjaExampleKoreanWordType } from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";
import { useHanjaExampleKoreanWordListenerHandler } from "@repo/shared/hooks/listener-handlers/viewSpecificListenerHandlers";
import { PaginatedResultsFormatter } from "../api-result-formatters/paginated-results/PaginatedResultsFormatter";
import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import { HanjaExampleKoreanWord } from "../item-components/hanja/detail/HanjaExampleKoreanWord";

export const HanjaExamplesView = ({
  character,
  pageNum,
}: {
  character: string;
  pageNum: number;
}) => {
  const url = getEndpoint({
    endpoint: "examples_hanja",
    pk: character,
    queryParams: {
      page: pageNum,
    },
  });

  const { requestState, refetch } = useFetchProps({
    url: url,
    useCallAPIInstance: useCallAPIWeb({ cacheResults: true }),
    refetchDependencyArray: [url],
  });

  useHanjaExampleKoreanWordListenerHandler({
    url,
    response: requestState.response,
    refetch,
  });

  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  const handlePageChange = (newPage: number) => {
    panelDispatchStateChangeSelf({
      type: "update_hanja_detail_interaction_data",
      key: "exampleWordsPageNum",
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
        searchTerm={character}
        verifier={isHanjaExampleKoreanWordType}
        ResultComponent={HanjaExampleKoreanWord}
      />

      <PageChanger
        pageNum={pageNum}
        setPageNum={handlePageChange}
        responseCount={requestState?.response?.count}
      />
    </>
  );
};
