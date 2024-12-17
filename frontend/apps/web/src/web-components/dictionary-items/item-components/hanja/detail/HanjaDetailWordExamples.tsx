import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { PageChanger } from "../../../../dictionary-page/views/view-components/PageChanger";
import { ResultCountMessage } from "../../../../dictionary-page/views/view-components/ResultsMessages";
import { useCallAPIWeb } from "../../../../../shared-web-hooks/useCallAPIWeb";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import {
  isHanjaExampleKoreanWordType,
  KoreanWordInHanjaExamplesType,
} from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";
import { ReactNode } from "react";
import { KoreanWordTogglers } from "../../shared/known-studied/KnownStudiedTogglers";
import { StringWithHanja } from "../../shared/formatted-string/StringWithHanja";
import { StringWithNLPAndHanja } from "../../shared/formatted-string/FormattedString";
import { useHanjaExampleKoreanWordListenerManager } from "@repo/shared/hooks/listener-handlers/useListenerHandlers";
import { PaginatedResultsFormatter } from "../../../api-result-formatters/PaginatedResultsFormatter";
import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import { DetailViewBaseDefaultHideableDropdownNoTruncation } from "../../shared/ReusedFormatters";

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

  const { requestState, refetch } = useFetchProps({
    url: url,
    useCallAPIInstance: useCallAPIWeb({ cacheResults: true }),
    refetchDependencyArray: [url],
  });

  useHanjaExampleKoreanWordListenerManager({
    url,
    response: requestState.response,
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

  return (
    <DetailViewBaseDefaultHideableDropdownNoTruncation
      title="용례 단어"
      droppedDown={droppedDown}
      onDropdownStateToggle={handleDropdownStateToggle}
    >
      <ResultCountMessage
        pageNum={pageNum}
        responseCount={requestState?.response?.count}
      />

      <PaginatedResultsFormatter
        requestState={requestState}
        searchTerm={character}
        verifier={isHanjaExampleKoreanWordType}
        ResultComponent={ExampleWord}
      />

      <PageChanger
        pageNum={pageNum}
        setPageNum={handlePageChange}
        responseCount={requestState?.response?.count}
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
