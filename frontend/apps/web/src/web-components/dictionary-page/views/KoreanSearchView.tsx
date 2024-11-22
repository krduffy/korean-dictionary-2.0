import { getEndpointWithKoreanSearchConfig } from "@repo/shared/utils/apiAliases";
import { usePaginatedResults } from "@repo/shared/hooks/usePaginatedResults";
import { useCallAPIWeb } from "../../../web-hooks/useCallAPIWeb";
import { KoreanSearchResult } from "../dictionary-items/KoreanSearchResult";
import { LoadingIndicator } from "../../other/misc/LoadingIndicator";
import { NoResultsMessage, ResultCountMessage } from "./ResultsMessages";
import { KoreanSearchResultType } from "@repo/shared/types/dictionaryItemProps";
import { PageChanger } from "./PageChanger";
import { KoreanSearchConfig } from "@repo/shared/types/panelAndViewTypes";
import { useViewDispatchersContext } from "../../../web-contexts/ViewDispatchersContext";
import { ErrorMessage } from "../../other/misc/ErrorMessage";
import { isKoreanSearchResultType } from "@repo/shared/types/typeGuards";

export const KoreanSearchView = ({
  searchConfig,
}: {
  searchConfig: KoreanSearchConfig;
}) => {
  const { dispatch } = useViewDispatchersContext();

  const { successful, error, loading, searchResults, response } =
    usePaginatedResults({
      baseUrl: getEndpointWithKoreanSearchConfig(searchConfig),
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

  if (!searchResults.results.every((data) => isKoreanSearchResultType(data))) {
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
      {searchResults.results.map((result: KoreanSearchResultType) => (
        <div
          className="bg-[color:--background-tertiary] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
    border border-gray-200/20 p-4 my-4"
          key={result.target_code}
        >
          <KoreanSearchResult result={result} />
        </div>
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
