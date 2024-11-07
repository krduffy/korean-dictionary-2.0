import { KoreanSearchResultType } from "@repo/shared/types/dictionaryItemProps";
import { PanelSpecificDispatcher } from "../string-formatters/PanelSpecificDispatcher";
import { StringWithHanja } from "../string-formatters/StringWithHanja";

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
          {/*result.origin && <StringWithHanja string={result.origin} />*/}
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
