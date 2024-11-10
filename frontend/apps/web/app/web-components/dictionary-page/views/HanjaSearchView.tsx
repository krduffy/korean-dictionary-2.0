import { usePaginatedResults } from "@repo/shared/hooks/usePaginatedResults";
import { HanjaSearchResultType } from "@repo/shared/types/dictionaryItemProps";
import { getEndpointWithHanjaSearchConfig } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "app/web-hooks/useCallAPIWeb";
import { HanjaSearchResult } from "../dictionary-items/HanjaSearchResult";
import { NoResultsMessage } from "../string-formatters/ResultsMessages";
import { LoadingIndicator } from "../string-formatters/LoadingIndicator";
import { PageChanger } from "./PageChanger";
import { HanjaSearchConfig } from "@repo/shared/types/panelAndViewTypes";
import { useViewDispatchersContext } from "app/web-contexts/ViewDispatchersContext";

type HanjaSearchData = {
  searchConfig: HanjaSearchConfig;
};

export const HanjaSearchView: React.FC<HanjaSearchData> = ({
  searchConfig,
}) => {
  const { dispatch } = useViewDispatchersContext();

  const { successful, error, loading, searchResults } = usePaginatedResults({
    baseUrl: getEndpointWithHanjaSearchConfig(searchConfig),
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
      {searchResults?.results?.map((result: HanjaSearchResultType) => (
        <HanjaSearchResult key={result.character} result={result} />
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
