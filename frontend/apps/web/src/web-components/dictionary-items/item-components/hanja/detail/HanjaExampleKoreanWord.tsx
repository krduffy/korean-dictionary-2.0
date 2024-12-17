import { KoreanWordInHanjaExamplesType } from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";
import { KoreanWordTogglers } from "../../shared/known-studied/KnownStudiedTogglers";
import { StringWithHanja } from "../../shared/formatted-string/StringWithHanja";
import { StringWithNLPAndHanja } from "../../shared/formatted-string/FormattedString";

export const HanjaExampleKoreanWord = ({
  result,
}: {
  result: KoreanWordInHanjaExamplesType;
}) => {
  return (
    <>
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
    </>
  );
};
