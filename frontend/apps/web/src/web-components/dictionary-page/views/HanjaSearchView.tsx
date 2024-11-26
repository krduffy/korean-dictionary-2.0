import { usePaginatedResults } from "@repo/shared/hooks/usePaginatedResults";
import { HanjaSearchResultType } from "@repo/shared/types/dictionaryItemProps";
import { getEndpointWithHanjaSearchConfig } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../web-hooks/useCallAPIWeb";
import { HanjaSearchResult } from "../dictionary-items/HanjaSearchResult";
import {
  NoResultsMessage,
  ResultCountMessage,
} from "./view-components/ResultsMessages";
import { LoadingIndicator } from "../../other/misc/LoadingIndicator";
import { PageChanger } from "./view-components/PageChanger";
import { HanjaSearchConfig } from "@repo/shared/types/panelAndViewTypes";
import { useViewDispatchersContext } from "../../../web-contexts/ViewDispatchersContext";
import { ErrorMessage } from "../../other/misc/ErrorMessage";
import {
  isHanjaSearchResultType,
  isNumber,
} from "@repo/shared/types/typeGuards";
import {
  NoResponseError,
  NotAnArrayError,
  WrongFormatError,
} from "../../other/misc/ErrorMessageTemplates";
import { API_PAGE_SIZE, FALLBACK_MAX_TIME_MS } from "@repo/shared/constants";
import { useShowFallback } from "@repo/shared/hooks/useShowFallback";

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
      useCallAPIInstance: useCallAPIWeb({ cacheResults: true }),
    });

  const { showFallback } = useShowFallback({
    loading: loading,
    successful: successful,
    fallbackMaxTimeMs: FALLBACK_MAX_TIME_MS,
  });

  if (showFallback || loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorMessage errorResponse={response} />;
  }

  if (!searchResults) {
    return <NoResponseError />;
  }

  if (searchResults.count === 0) {
    return <NoResultsMessage searchTerm={searchConfig.search_term} />;
  }

  if (!Array.isArray(searchResults.results)) {
    return <NotAnArrayError />;
  }

  if (!searchResults.results.every((data) => isHanjaSearchResultType(data))) {
    return <WrongFormatError />;
  }

  if (!isNumber(searchResults.count)) {
    return <WrongFormatError />;
  }

  const maxPageNum = Math.ceil(searchResults.count / API_PAGE_SIZE);

  return (
    <>
      <ResultCountMessage
        pageNum={searchConfig.page}
        totalResults={searchResults.count}
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
