import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { useEffect } from "react";

import { useCallAPIWeb } from "../../../shared-web-hooks/useCallAPIWeb";

import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import { isKoreanSearchResultType } from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { useKoreanSearchResultListenerHandler } from "@repo/shared/hooks/listener-handlers/viewSpecificListenerHandlers";
import {
  DerivedExampleTextEojeolNumLemmasInteractionData,
  DerivedExampleTextInteractionData,
  KoreanSearchInteractionData,
} from "@repo/shared/types/views/interactionDataTypes";

import { ResultCountMessage } from "../api-result-formatters/paginated-results/ResultsMessages";
import { PageChanger } from "../api-result-formatters/paginated-results/PageChanger";
import { PaginatedResultsFormatter } from "../api-result-formatters/paginated-results/PaginatedResultsFormatter";
import { KoreanSearchResult } from "../item-components/korean/KoreanSearchResult";
import { DerivedExampleTextEojeolNumLemmasData } from "@repo/shared/types/views/userExampleViewTypes";

export const DerivedExampleTextEojeolNumLemmasView = ({
  data,
}: {
  data: DerivedExampleTextEojeolNumLemmasData;
}) => {
  const url = getEndpoint({
    endpoint: "get_derived_example_lemmas_from_text_at_eojeol_num",
    queryParams: {
      page: data.page,
    },
    pk: [data.source_text_pk, data.eojeol_num],
  });

  const { requestState, refetch } = useFetchProps({
    url: url,
    useCallAPIInstance: useCallAPIWeb({ cacheResults: true }),
    refetchDependencyArray: [data.page, data.eojeol_num, data.source_text_pk],
  });

  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  useKoreanSearchResultListenerHandler({
    url: url,
    response: requestState.response,
    refetch: refetch,
  });

  useEffect(() => {
    if (requestState.response?.count === 1) {
      panelDispatchStateChangeSelf({
        type: "push_korean_detail",
        // @ts-ignore
        target_code: requestState.response.results[0].target_code,
        overwriteCurrentView: true,
      });
    }
  }, [requestState.response]);

  return (
    <>
      <ResultCountMessage
        pageNum={data.page}
        responseCount={requestState?.response?.count}
      />

      <PaginatedResultsFormatter
        requestState={requestState}
        verifier={isKoreanSearchResultType}
        ResultComponent={KoreanSearchResult}
      />

      <PageChanger
        pageNum={data.page}
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
