import { getEndpoint } from "@repo/shared/utils/apiAliases";

import { usePaginatedResults } from "@repo/shared/hooks/usePaginatedResults";
import { useCallAPIWeb } from "app/web-hooks/useCallAPIWeb";

export const KoreanSearchView = () => {
  const {
    successful,
    error,
    loading,
    searchResults,
    currentPage,
    setCurrentPage,
  } = usePaginatedResults({
    baseUrl: getEndpoint({ endpoint: "search_korean" }),
    useCallAPIInstance: useCallAPIWeb().useCallAPIReturns,
    initialPage: 1,
  });

  return <>{successful && <div>have results</div>}</>;
};
