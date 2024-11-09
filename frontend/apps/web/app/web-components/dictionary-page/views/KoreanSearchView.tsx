import { getEndpointWithKoreanSearchConfig } from "@repo/shared/utils/apiAliases";

import { usePaginatedResults } from "@repo/shared/hooks/usePaginatedResults";
import { useCallAPIWeb } from "app/web-hooks/useCallAPIWeb";
import { KoreanSearchResult } from "../dictionary-items/KoreanSearchResult";
import { LoadingIndicator } from "../string-formatters/LoadingIndicator";
import { NoResultsMessage } from "../string-formatters/NoSearchResultsMessage";
import { KoreanSearchResultType } from "@repo/shared/types/dictionaryItemProps";
import { PageChanger } from "./PageChanger";
import { KoreanSearchConfig } from "@repo/shared/types/panelAndViewTypes";
import { useViewDispatchersContext } from "app/web-contexts/ViewDispatchersContext";

export const KoreanSearchView = ({
  searchConfig,
}: {
  searchConfig: KoreanSearchConfig;
}) => {
  const { dispatch } = useViewDispatchersContext();

  const { successful, error, loading, searchResults } = usePaginatedResults({
    baseUrl: getEndpointWithKoreanSearchConfig(searchConfig),
    useCallAPIInstance: useCallAPIWeb({ cacheResults: true }).useCallAPIReturns,
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
    return <NoResultsMessage searchTerm={searchConfig.search_term} />;
  }

  return (
    <>
      {searchResults?.results?.map((result: KoreanSearchResultType) => (
        <div
          className="bg-[color:--background-tertiary] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
    border border-gray-200/20 p-2 mb-4"
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
        maxPageNum={Math.ceil(searchResults.count / 5)}
      />
    </>
  );
};
