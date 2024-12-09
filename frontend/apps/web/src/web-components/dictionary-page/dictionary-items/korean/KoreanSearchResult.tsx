import { PanelSpecificDispatcher } from "../../panel/PanelSpecificDispatcher";
import { StringWithHanja } from "../../../other/string-formatters/StringWithHanja";
import { StringWithNLPAndHanja } from "../.././../other/string-formatters/StringWithNLP";
import { SearchResultSideInfoStyler } from "../.././../other/string-formatters/SpanStylers";
import { KoreanWordTogglers } from "../known-studied/KnownStudiedTogglers";
import { memo } from "react";
import { KoreanSearchResultType } from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { SimplifiedSenseType } from "@repo/shared/types/views/dictionary-items/senseDictionaryItems";

export const KoreanSearchResult = memo(
  ({ result }: { result: KoreanSearchResultType }) => {
    return (
      <>
        {/* Header with word and origin */}
        <div className="pb-4 flex flex-row justify-between items-center">
          <div className="flex flex-row gap-4">
            <div className="text-[170%] text-[color:--accent-1] cursor-pointer">
              <PanelSpecificDispatcher
                panelStateAction={{
                  type: "push_korean_detail",
                  target_code: result.target_code,
                }}
              >
                {result.word}
              </PanelSpecificDispatcher>
            </div>
            {result.origin /* gets rid of empty strings adding in padding from the gap */ && (
              <div className="self-center text-[130%]">
                <SearchResultSideInfoStyler>
                  <StringWithHanja string={result.origin} />
                </SearchResultSideInfoStyler>
              </div>
            )}
          </div>
          {/* for known studied togglers*/}
          {result.user_data && (
            <div className="self-center">
              <KoreanWordTogglers
                pk={result.target_code}
                initiallyKnown={result.user_data.is_known}
                initiallyStudied={result.user_data.is_studied}
              />
            </div>
          )}
        </div>

        {/* Senses */}
        <div>
          {result.senses.map((senseData) => (
            <SimplifiedSense key={senseData.target_code} data={senseData} />
          ))}
        </div>
      </>
    );
  }
);

const SimplifiedSense = ({ data }: { data: SimplifiedSenseType }) => {
  return (
    <div>
      <span>{data.order}. </span>
      {data.category && (
        <span className="text-[color:--accent-3]">{data.category} </span>
      )}
      {data.type && (
        <span className="text-[color:--accent-4]">{data.type} </span>
      )}
      {data.pos && <span className="text-[color:--accent-5]">{data.pos} </span>}
      <StringWithNLPAndHanja string={data.definition} />
    </div>
  );
};