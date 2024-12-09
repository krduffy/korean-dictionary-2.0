import { SearchBarConfig } from "@repo/shared/types/views/searchConfigTypes";
import {
  TraditionalHanjaText,
  TraditionalKoreanText,
} from "../../../other/string-formatters/SpanStylers";

export const DictionarySelector = ({
  searchConfig,
  switchDictionary,
}: {
  searchConfig: SearchBarConfig;
  switchDictionary: () => void;
}) => {
  const dictionaryButtonContent = (
    <span className="text-xl">
      {searchConfig.dictionary === "korean" ? (
        <TraditionalKoreanText>한</TraditionalKoreanText>
      ) : (
        <TraditionalHanjaText>漢</TraditionalHanjaText>
      )}
    </span>
  );

  const dictionaryLabel =
    searchConfig.dictionary === "korean" ? (
      <span>한국어</span>
    ) : (
      <span>한자</span>
    );

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <button
          className="border-2 text-[color:--accent-button-text-color] bg-[color:--accent-button-color] p-2 border-1 rounded-xl border-[color:--border-color]"
          onClick={switchDictionary}
        >
          {dictionaryButtonContent}
        </button>

        <div>{dictionaryLabel}</div>
      </div>
    </div>
  );
};
