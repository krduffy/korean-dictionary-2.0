import { usePaginatedResults } from "@repo/shared/hooks/usePaginatedResults";
import { HanjaSearchResultType } from "@repo/shared/types/dictionaryItemProps";
import { getEndpointWithHanjaSearchConfig } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../web-hooks/useCallAPIWeb";
import { HanjaSearchResult } from "../dictionary-items/HanjaSearchResult";
import { NoResultsMessage, ResultCountMessage } from "./ResultsMessages";
import { LoadingIndicator } from "../../other/misc/LoadingIndicator";
import { PageChanger } from "./PageChanger";
import { HanjaSearchConfig } from "@repo/shared/types/panelAndViewTypes";
import { useViewDispatchersContext } from "../../../web-contexts/ViewDispatchersContext";
import { ErrorMessage } from "../../other/misc/ErrorMessage";
import { isHanjaSearchResultType } from "@repo/shared/types/typeGuards";

type HanjaSearchData = {
  searchConfig: HanjaSearchConfig;
};

export const HanjaSearchView: React.FC<HanjaSearchData> = ({
  searchConfig,
}) => {
  const { dispatch } = useViewDispatchersContext();

  const { successful, error, loading, searchResults, response } =
    usePaginatedResults({
      baseUrl: getEndpointWithHanjaSearchConfig(searchConfig),
      useCallAPIInstance: useCallAPIWeb({ cacheResults: true })
        .useCallAPIReturns,
    });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorMessage errorResponse={response} />;
  }

  if (searchResults?.count === 0) {
    return <NoResultsMessage searchTerm={searchConfig.search_term} />;
  }

  /* additional error handling */
  if (!searchResults?.results) {
    return (
      <ErrorMessage
        errorResponse={{ 오류: "api 응답은 결과가 없는 것 같습니다." }}
      />
    );
  }

  if (!Array.isArray(searchResults.results)) {
    return (
      <ErrorMessage errorResponse={{ 오류: "검색 결과는 배열이 아닙니다." }} />
    );
  }

  if (!searchResults.results.every((data) => isHanjaSearchResultType(data))) {
    return (
      <ErrorMessage
        errorResponse={{ 오류: "검색 결과 하나 이상은 구조가 안 됩니다." }}
      />
    );
  }

  const totalResults =
    typeof searchResults?.count == "number" ? searchResults.count : 0;
  const maxPageNum =
    typeof searchResults?.count === "number"
      ? Math.ceil(searchResults?.count / 5)
      : 1;

  return (
    <>
      <ResultCountMessage
        pageNum={searchConfig.page}
        totalResults={totalResults}
      />
      {searchResults.results.map((result: HanjaSearchResultType) => (
        <HanjaSearchResult key={result.character} result={result} />
      ))}
      <PageChanger
        pageNum={searchConfig.page}
        setPageNum={(newPage: number) =>
          dispatch({ type: "update_page", newPage: newPage })
        }
        maxPageNum={maxPageNum}
      />
    </>
  );
};
