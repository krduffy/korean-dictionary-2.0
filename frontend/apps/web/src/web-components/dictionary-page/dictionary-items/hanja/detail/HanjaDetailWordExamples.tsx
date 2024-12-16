import { API_PAGE_SIZE } from "@repo/shared/constants";
import { usePaginatedResults } from "@repo/shared/hooks/api/usePaginatedResults";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { PageChanger } from "../../../../dictionary-page/views/view-components/PageChanger";
import {
  NoResultsMessage,
  ResultCountMessage,
} from "../../../../dictionary-page/views/view-components/ResultsMessages";
import { ErrorMessage } from "../../../../other/misc/ErrorMessage";
import {
  NoResponseError,
  NotAnArrayError,
  WrongFormatError,
} from "../../../../other/misc/ErrorMessageTemplates";
import { useCallAPIWeb } from "../../../../../web-hooks/useCallAPIWeb";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import {
  isHanjaExampleKoreanWordType,
  KoreanWordInHanjaExamplesType,
} from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";
import { isNumber } from "@repo/shared/types/guardUtils";
import { ReactNode } from "react";
import { KoreanWordTogglers } from "../../known-studied/KnownStudiedTogglers";
import { StringWithHanja } from "../../../../other/string-formatters/StringWithHanja";
import { StringWithNLPAndHanja } from "../../../../other/string-formatters/StringWithNLP";
import { DetailViewBaseDefaultHideableDropdownNoTruncation } from "../../ReusedFormatters";
import { useHanjaExampleKoreanWordListenerManager } from "@repo/shared/hooks/listener-handlers/useListenerHandlers";

export const HanjaDetailWordExamples = ({
  character,
  pageNum,
  droppedDown,
}: {
  character: string;
  pageNum: number;
  droppedDown: boolean;
}) => {
  const url = getEndpoint({
    endpoint: "examples_hanja",
    pk: character,
    queryParams: {
      page: pageNum,
    },
  });

  const { searchResults, loading, error, response, refetch } =
    usePaginatedResults({
      baseUrl: url,
      useCallAPIInstance: useCallAPIWeb({ cacheResults: true }),
    });

  useHanjaExampleKoreanWordListenerManager({
    url,
    searchResults,
    refetch,
  });

  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  const handleDropdownStateToggle = (isToggled: boolean) => {
    panelDispatchStateChangeSelf({
      type: "update_hanja_detail_interaction_data",
      key: "exampleWordsDroppedDown",
      newValue: isToggled,
    });
  };

  const handlePageChange = (newPage: number) => {
    panelDispatchStateChangeSelf({
      type: "update_hanja_detail_interaction_data",
      key: "exampleWordsPageNum",
      newValue: newPage,
    });
  };

  if (loading) {
    return (
      <DetailViewBaseDefaultHideableDropdownNoTruncation
        title="용례 단어"
        droppedDown={droppedDown}
        onDropdownStateToggle={handleDropdownStateToggle}
      >
        {Array(API_PAGE_SIZE)
          .fill(0)
          .map((_, id) => (
            <ExampleWordSkeleton key={id} />
          ))}
      </DetailViewBaseDefaultHideableDropdownNoTruncation>
    );
  }

  if (error) {
    return <ErrorMessage errorResponse={response} />;
  }

  if (!searchResults) {
    return <NoResponseError />;
  }

  if (searchResults.count === 0) {
    return <NoResultsMessage searchTerm={character} />;
  }

  if (!Array.isArray(searchResults.results)) {
    return <NotAnArrayError />;
  }

  if (
    !searchResults.results.every((data) => isHanjaExampleKoreanWordType(data))
  ) {
    return <WrongFormatError />;
  }

  if (!isNumber(searchResults.count)) {
    return <WrongFormatError />;
  }

  const maxPageNum = Math.ceil(searchResults.count / API_PAGE_SIZE);

  return (
    <DetailViewBaseDefaultHideableDropdownNoTruncation
      title="용례 단어"
      droppedDown={droppedDown}
      onDropdownStateToggle={handleDropdownStateToggle}
    >
      <ResultCountMessage
        pageNum={pageNum}
        totalResults={searchResults.count}
      />

      {searchResults.results.map((result: KoreanWordInHanjaExamplesType) => (
        <ExampleWord key={result.target_code} result={result} />
      ))}

      <PageChanger
        pageNum={pageNum}
        setPageNum={handlePageChange}
        maxPageNum={maxPageNum}
      />
    </DetailViewBaseDefaultHideableDropdownNoTruncation>
  );
};

const ExampleWordStyler = ({
  children,
  additionalStyling = "",
}: {
  children?: ReactNode;
  additionalStyling?: string;
}) => {
  return (
    <div
      className={`bg-[color:--background-tertiary] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
    border border-gray-200/20 p-4 my-4 ${additionalStyling}`}
    >
      {children}
    </div>
  );
};

const ExampleWordSkeleton = () => {
  return (
    <ExampleWordStyler additionalStyling="min-h-16 animate-pulse">
      <div className="grid">
        <div className="row-span-1 col-span-1 bg-slate-700"></div>
        <div className="row-span-1 col-span-4 bg-slate-700"></div>
      </div>
    </ExampleWordStyler>
  );
};

const ExampleWord = ({ result }: { result: KoreanWordInHanjaExamplesType }) => {
  return (
    <ExampleWordStyler>
      <div className="flex flex-row items-end justify-between pb-3">
        <div className="flex flex-row gap-4 items-end">
          <div className="text-[130%]">
            <StringWithHanja string={result.origin} />
          </div>
          <div className="text-[100%]">{result.word}</div>
        </div>
        {result.user_data && (
          <KoreanWordTogglers
            pk={result.target_code}
            initiallyKnown={result.user_data.is_known}
            initiallyStudied={result.user_data.is_studied}
          />
        )}
      </div>

      <div>
        <StringWithNLPAndHanja string={result.first_sense.definition} />
      </div>
    </ExampleWordStyler>
  );
};
