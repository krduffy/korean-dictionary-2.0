import { KoreanWordInHanjaExamplesType } from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";
import { KoreanWordKnownStudiedTogglers } from "../../shared/known-studied/KnownStudiedDisplayers";
import { StringWithHanja } from "../../shared/formatted-string/StringWithHanja";
import { StringWithNLPAndHanja } from "../../shared/formatted-string/FormattedString";
import { PanelSpecificDispatcher } from "../../../../pages/dictionary-page/PanelSpecificDispatcher";
import { DetailViewLinkStyler } from "../../../../text-formatters/SpanStylers";

export const HanjaExampleKoreanWord = ({
  result,
}: {
  result: KoreanWordInHanjaExamplesType;
}) => {
  return (
    <>
      <div className="flex flex-row items-center justify-between pb-3">
        <div className="flex flex-row gap-4 items-center">
          <div className="text-[180%] text-[color:--accent-1]">
            <StringWithHanja string={result.origin} />
          </div>
          <div className="text-[120%]">
            <PanelSpecificDispatcher
              panelStateAction={{
                type: "push_korean_detail",
                target_code: result.target_code,
              }}
            >
              <DetailViewLinkStyler>{result.word}</DetailViewLinkStyler>
            </PanelSpecificDispatcher>
          </div>
        </div>
        {result.user_data && (
          <KoreanWordKnownStudiedTogglers
            pk={result.target_code}
            initiallyKnown={result.user_data.is_known}
            initiallyStudied={result.user_data.is_studied}
          />
        )}
      </div>

      <div>
        <StringWithNLPAndHanja string={result.first_sense.definition} />
      </div>
    </>
  );
};
