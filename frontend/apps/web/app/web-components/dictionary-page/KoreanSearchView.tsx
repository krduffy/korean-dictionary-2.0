import { getEndpointWithKoreanSearchConfig } from "@repo/shared/utils/apiAliases";

import { usePaginatedResults } from "@repo/shared/hooks/usePaginatedResults";
import { useCallAPIWeb } from "app/web-hooks/useCallAPIWeb";
import { KoreanSearchResult } from "./dictionary-items/KoreanSearchResult";
import { KoreanSearchConfig } from "@repo/shared/types/panelAndViewTypes";
import { LoadingIndicator } from "./string-formatters/LoadingIndicator";
import { NoResultsMessage } from "./string-formatters/NoSearchResultsMessage";
import { KoreanSearchResultType } from "@repo/shared/types/dictionaryItemProps";

export const KoreanSearchView = ({ data }: { data: KoreanSearchConfig }) => {
  const {
    successful,
    error,
    loading,
    searchResults,
    currentPage,
    setCurrentPage,
  } = usePaginatedResults({
    baseUrl: getEndpointWithKoreanSearchConfig({ koreanSearchConfig: data }),
    useCallAPIInstance: useCallAPIWeb().useCallAPIReturns,
    initialPage: 1,
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <div>오류가발생했습니다</div>;
  }

  /* should not ever be false but in case */
  if (!successful) {
    return <div>오류가 발생했습니다</div>;
  }

  if (searchResults?.count === 0) {
    return <NoResultsMessage searchTerm={data.search_term} />;
  }

  return (
    <>
      {searchResults?.results?.map((result: KoreanSearchResultType) => (
        <KoreanSearchResult key={result.target_code} result={result} />
      ))}
    </>
  );
};
