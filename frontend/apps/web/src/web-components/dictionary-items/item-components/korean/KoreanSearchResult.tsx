import { PanelSpecificDispatcher } from "../../../pages/dictionary-page/PanelSpecificDispatcher";
import { StringWithHanja } from "../shared/formatted-string/StringWithHanja";
import {
  DetailViewLinkStyler,
  Href,
  SearchResultSideInfoStyler,
  Source,
} from "../.././../text-formatters/SpanStylers";
import { KoreanHeadwordKnownStudiedTogglers } from "../shared/known-studied/KnownStudiedDisplayers";
import { memo } from "react";
import { KoreanSearchResultType } from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { SimplifiedSenseType } from "@repo/shared/types/views/dictionary-items/senseDictionaryItems";
import { ResultRankingStars } from "../shared/ResultRankingStars";
import { SenseCategoriesAndDefinition } from "./SenseCategoriesAndDefinition";

export const KoreanSearchResult = memo(
  ({ result }: { result: KoreanSearchResultType }) => {
    return (
      <>
        {/* Header with word and origin */}
        <div className="pb-4 flex flex-row justify-between items-center">
          <KoreanSearchResultTopInfo result={result} />
        </div>

        {/* Senses */}
        <div>
          {result.senses.map((senseData) => (
            <SimplifiedSense key={senseData.target_code} data={senseData} />
          ))}
        </div>

        <br />

        <KoreanSearchResultSource word={result.word} />
      </>
    );
  }
);

const KoreanSearchResultTopInfo = ({
  result,
}: {
  result: KoreanSearchResultType;
}) => {
  return (
    <>
      <div className="flex flex-row gap-4">
        <div className="text-[170%] text-[color:--accent-1]">
          <PanelSpecificDispatcher
            panelStateAction={{
              type: "push_korean_detail",
              target_code: result.target_code,
            }}
          >
            <DetailViewLinkStyler>{result.word}</DetailViewLinkStyler>
          </PanelSpecificDispatcher>
        </div>
        {result.origin /* gets rid of empty strings adding in padding from the gap */ && (
          <div className="self-center text-[130%]">
            <SearchResultSideInfoStyler>
              <StringWithHanja string={result.origin} />
            </SearchResultSideInfoStyler>
          </div>
        )}
        <div className="flex justify-center items-center">
          <ResultRankingStars
            numStars={result.result_ranking}
            widthAndHeightPx={24}
          />
        </div>
      </div>
      {/* for known studied togglers*/}
      {result.user_data && (
        <div className="self-center">
          <KoreanHeadwordKnownStudiedTogglers
            pk={result.target_code}
            isKnown={result.user_data.is_known}
            isStudied={result.user_data.is_studied}
          />
        </div>
      )}
    </>
  );
};

const KoreanSearchResultSource = ({ word }: { word: string }) => {
  return (
    <footer>
      <Source>
        출처:{" "}
        <Href
          urlString={`https://opendict.korean.go.kr/search/searchResult?query=${word}`}
        >
          우리말샘
        </Href>
      </Source>
    </footer>
  );
};

const SimplifiedSense = ({ data }: { data: SimplifiedSenseType }) => {
  return (
    <div>
      <span>{data.order}. </span>
      <SenseCategoriesAndDefinition
        definition={data.definition}
        type={data.type}
        pos={data.pos}
        category={data.category}
      />
    </div>
  );
};
