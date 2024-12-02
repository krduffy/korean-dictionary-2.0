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
import { API_PAGE_SIZE } from "@repo/shared/constants";

type HanjaSearchData = {
  searchConfig: HanjaSearchConfig;
};

export const HanjaSearchView: React.FC<HanjaSearchData> = ({
  searchConfig,
}) => {
  const { dispatch } = useViewDispatchersContext();

  const { error, loading, searchResults, response } = usePaginatedResults({
    baseUrl: getEndpointWithHanjaSearchConfig(searchConfig),
    useCallAPIInstance: useCallAPIWeb({ cacheResults: true }),
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
        <div
          className="bg-[color:--background-tertiary] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
    border border-gray-200/20 p-4 my-4"
          key={result.character}
        >
          <HanjaSearchResult key={result.character} result={result} />
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
