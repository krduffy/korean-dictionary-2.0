import { isKoreanSearchResultType } from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { ResultCountMessage } from "../api-result-formatters/paginated-results/ResultsMessages";
import { PageChanger } from "../api-result-formatters/paginated-results/PageChanger";
import { PaginatedResultsFormatter } from "../api-result-formatters/paginated-results/PaginatedResultsFormatter";
import { KoreanSearchResult } from "../item-components/korean/KoreanSearchResult";
import { DerivedExampleTextEojeolNumLemmasData } from "@repo/shared/types/views/userExampleViewTypes";
import { useDerivedExampleTextEojeolNumLemmasView } from "./useDerivedExampleTextEojeolNumLemmasView";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";

export const DerivedExampleTextEojeolNumLemmasView = ({
  data,
}: {
  data: DerivedExampleTextEojeolNumLemmasData;
}) => {
  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();
  const { fakedRequestState } = useDerivedExampleTextEojeolNumLemmasView({
    data: data,
  });

  return (
    <>
      <ResultCountMessage
        pageNum={data.page}
        responseCount={fakedRequestState?.response?.count}
      />

      <PaginatedResultsFormatter
        requestState={fakedRequestState}
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
        responseCount={fakedRequestState?.response?.count}
      />
    </>
  );
};
