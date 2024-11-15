import {
  KoreanSearchResultType,
  SimplifiedSenseType,
} from "@repo/shared/types/dictionaryItemProps";
import { PanelSpecificDispatcher } from "../panel/PanelSpecificDispatcher";
import { StringWithHanja } from "../../other/string-formatters/StringWithHanja";
import { StringWithNLPAndHanja } from "../../other/string-formatters/StringWithNLP";
import {
  SearchResultSideInfoStyler,
  SearchResultStyler,
} from "../../other/string-formatters/SpanStylers";
import { KoreanWordKnownToggler } from "./KnownStudiedTogglers";

export const KoreanSearchResult = ({
  result,
}: {
  result: KoreanSearchResultType;
}) => {
  return (
    <>
      {/* Header with word and origin */}
      <div className="pb-2 flex flex-row">
        <div>
          <span className="pr-4">
            <SearchResultStyler>
              <PanelSpecificDispatcher
                panelStateAction={{
                  type: "push_korean_detail",
                  target_code: result.target_code,
                }}
              >
                {result.word}
              </PanelSpecificDispatcher>
            </SearchResultStyler>
          </span>

          <SearchResultSideInfoStyler>
            <StringWithHanja string={result.origin} />
          </SearchResultSideInfoStyler>
        </div>

        {/* for known studied togglers*/}
        <div>
          <KoreanWordKnownToggler
            pk={result.target_code}
            initiallyKnown={result.user_data?.is_known}
          />
        </div>
      </div>

      {/* Senses */}
      <div>
        {result.senses.map((senseData) => (
          <SimplifiedSense key={senseData.target_code} data={senseData} />
        ))}
      </div>

      <div>
        {result["user_data"] && (
          <span className="korean-result-know-study-container">
            {/*<KnowStudyToggles
              targetCode={result["target_code"]}
              initiallyKnown={result["user_data"]["is_known"]}
              initiallyStudied={result["user_data"]["is_studied"]}
            />*/}
          </span>
        )}
      </div>
    </>
  );
};

const SimplifiedSense = ({ data }: { data: SimplifiedSenseType }) => {
  return (
    <div>
      <span>{data.order}. </span>
      <span className="text-[color:--accent-3]">{data.category} </span>
      <span className="text-[color:--accent-4]">{data.type} </span>
      <span className="text-[color:--accent-5]">{data.pos} </span>
      <StringWithNLPAndHanja string={data.definition} />
    </div>
  );
};
