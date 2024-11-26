import { getEndpointWithKoreanSearchConfig } from "@repo/shared/utils/apiAliases";
import { usePaginatedResults } from "@repo/shared/hooks/usePaginatedResults";
import { useCallAPIWeb } from "../../../web-hooks/useCallAPIWeb";
import { KoreanSearchResult } from "../dictionary-items/KoreanSearchResult";
import { LoadingIndicator } from "../../other/misc/LoadingIndicator";
import {
  NoResultsMessage,
  ResultCountMessage,
} from "./view-components/ResultsMessages";
import { KoreanSearchResultType } from "@repo/shared/types/dictionaryItemProps";
import { PageChanger } from "./view-components/PageChanger";
import { KoreanSearchConfig } from "@repo/shared/types/panelAndViewTypes";
import { useViewDispatchersContext } from "../../../web-contexts/ViewDispatchersContext";
import { ErrorMessage } from "../../other/misc/ErrorMessage";
import {
  isKoreanSearchResultType,
  isNumber,
} from "@repo/shared/types/typeGuards";
import {
  NoResponseError,
  NotAnArrayError,
  WrongFormatError,
} from "../../other/misc/ErrorMessageTemplates";
import { API_PAGE_SIZE, FALLBACK_MAX_TIME_MS } from "@repo/shared/constants";
import { useShowFallback } from "@repo/shared/hooks/useShowFallback";

export const KoreanSearchView = ({
  searchConfig,
}: {
  searchConfig: KoreanSearchConfig;
}) => {
  const { dispatch } = useViewDispatchersContext();

  const { successful, error, loading, searchResults, response } =
    usePaginatedResults({
      baseUrl: getEndpointWithKoreanSearchConfig(searchConfig),
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

  if (!searchResults.results.every((data) => isKoreanSearchResultType(data))) {
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
