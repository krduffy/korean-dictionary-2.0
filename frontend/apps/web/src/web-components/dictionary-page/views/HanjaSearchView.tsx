import { usePaginatedResults } from "@repo/shared/hooks/usePaginatedResults";
import { HanjaSearchResultType } from "@repo/shared/types/dictionaryItemProps";
import { getEndpointWithHanjaSearchConfig } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../web-hooks/useCallAPIWeb";
import { HanjaSearchResult } from "../dictionary-items/HanjaSearchResult";
import { NoResultsMessage } from "./ResultsMessages";
import { LoadingIndicator } from "../../other/misc/LoadingIndicator";
import { PageChanger } from "./PageChanger";
import { HanjaSearchConfig } from "@repo/shared/types/panelAndViewTypes";
import { useViewDispatchersContext } from "../../../web-contexts/ViewDispatchersContext";
import { ErrorMessage } from "../../other/misc/ErrorMessage";

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
