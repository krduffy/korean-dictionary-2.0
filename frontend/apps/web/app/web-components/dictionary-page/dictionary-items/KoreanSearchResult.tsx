import {
  KoreanSearchResultType,
  SimplifiedSenseType,
} from "@repo/shared/types/dictionaryItemProps";
import { PanelSpecificDispatcher } from "../string-formatters/PanelSpecificDispatcher";
import { StringWithHanja } from "../string-formatters/StringWithHanja";
import { StringWithNLP } from "../string-formatters/StringWithNLP";

export const KoreanSearchResult = ({
  result,
}: {
  result: KoreanSearchResultType;
}) => {
  return (
    <div>
      <div className="header">
        <div>
          <span className="word_header clickable-result">
            <PanelSpecificDispatcher
              panelStateAction={{
                type: "push_korean_detail",
                target_code: result.target_code,
              }}
            >
              <span>{result.word}</span>
            </PanelSpecificDispatcher>
          </span>

          {"   "}

          <StringWithHanja string={result.origin} />
        </div>

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
      </div>
    </div>
  );
};

const SimplifiedSense = ({ data }: { data: SimplifiedSenseType }) => {
  return (
    <div>
      <StringWithNLP string={data.definition} />
    </div>
  );
};
