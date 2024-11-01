import { getEndpointWithKoreanViewData } from "@repo/shared/utils/apiAliases";

import { usePaginatedResults } from "@repo/shared/hooks/usePaginatedResults";
import { useCallAPIWeb } from "app/web-hooks/useCallAPIWeb";
import { KoreanSearchResult } from "../results/KoreanSearchResult";
import { KoreanSearchViewData } from "@repo/shared/types/panelAndViewTypes";

export const KoreanSearchView = ({ searchTerm }: { searchTerm: string }) => {
  const {
    successful,
    error,
    loading,
    searchResults,
    currentPage,
    setCurrentPage,
  } = usePaginatedResults({
    baseUrl: getEndpointWithKoreanViewData({ searchTerm: searchTerm }),
    useCallAPIInstance: useCallAPIWeb().useCallAPIReturns,
    initialPage: 1,
  });

  return (
    successful &&
    searchResults?.results?.map((result) => (
      <KoreanSearchResult key={result.target_code} result={result} />
    ))
  );
};
