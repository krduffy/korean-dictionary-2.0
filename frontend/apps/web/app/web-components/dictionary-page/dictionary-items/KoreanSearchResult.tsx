import { KoreanSearchResultType } from "@repo/shared/types/dictionaryItemProps";

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
            {result.word}
            {/*<PanelSpecificClickableText
              text={result.word}
              viewOnPush={getBasicDetailKoreanView(
                result.word,
                result.target_code
              )}
            />*/}
          </span>

          {"   "}

          {result.origin}
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
