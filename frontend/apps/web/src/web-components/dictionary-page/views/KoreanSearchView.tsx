import { usePaginatedResults } from "@repo/shared/hooks/api/usePaginatedResults";
import { useCallAPIWeb } from "../../../web-hooks/useCallAPIWeb";
import { KoreanSearchResult } from "../dictionary-items/korean/KoreanSearchResult";
import { LoadingIndicator } from "../../other/misc/LoadingIndicator";
import {
  NoResultsMessage,
  ResultCountMessage,
} from "./view-components/ResultsMessages";
import { PageChanger } from "./view-components/PageChanger";
import { ErrorMessage } from "../../other/misc/ErrorMessage";
import {
  NoResponseError,
  NotAnArrayError,
  WrongFormatError,
} from "../../other/misc/ErrorMessageTemplates";
import { API_PAGE_SIZE } from "@repo/shared/constants";
import { KoreanSearchConfig } from "@repo/shared/types/views/searchConfigTypes";
import {
  isKoreanSearchResultType,
  KoreanSearchResultType,
} from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { isNumber } from "@repo/shared/types/guardUtils";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useKoreanSearchResultListenerManager } from "@repo/shared/hooks/listener-handlers/useListenerHandlers";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";

export const KoreanSearchView = ({
  searchConfig,
}: {
  searchConfig: KoreanSearchConfig;
}) => {
  const { dispatch } = usePanelFunctionsContext();

  const url = getEndpoint({
    endpoint: "search_korean",
    queryParams: searchConfig,
  });

  const { error, loading, searchResults, refetchSearchResults, response } =
    usePaginatedResults({
      baseUrl: url,
      useCallAPIInstance: useCallAPIWeb({ cacheResults: true }),
    });

  useKoreanSearchResultListenerManager({
    url: url,
    searchResults: searchResults,
    refetchSearchResults: refetchSearchResults,
  });

  if (loading) {
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
