import { DerivedExampleTextHeadwordFromTextType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import React, { useRef, memo } from "react";
import { ResultRankingStars } from "../../shared/ResultRankingStars";
import { StringWithHanja } from "../../shared/formatted-string/StringWithHanja";
import { PanelSpecificDispatcher } from "../../../../pages/dictionary-page/PanelSpecificDispatcher";
import { DetailViewLinkStyler } from "../../../../text-formatters/SpanStylers";
import { SenseInKoreanExampleType } from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { useDerivedExampleTextContext } from "./DerivedExampleTextContext";
import { TextSearch } from "lucide-react";
import { useWidthObserver } from "../../../../../shared-web-hooks/useWidthObserver";

export const DerivedExampleTextHeadwordFromText = memo(
  ({ result }: { result: DerivedExampleTextHeadwordFromTextType }) => {
    return (
      <article className="flex items-center gap-4 flex-row w-full">
        <FindHeadwordInTextButton
          eojeolNumberInSourceText={result.eojeol_number_in_source_text}
        />
        <div className="flex-1 text-ellipsis whitespace-nowrap overflow-hidden">
          <TopBar
            word={result.headword_ref.word}
            wordTargetCode={result.headword_ref.target_code}
            origin={result.headword_ref.origin}
            resultRanking={result.headword_ref.result_ranking}
          />
          <FirstSensePreview firstSenseData={result.headword_ref.first_sense} />
        </div>
      </article>
    );
  }
);

const TopBar = ({
  word,
  wordTargetCode,
  origin,
  resultRanking,
}: {
  word: string;
  wordTargetCode: number;
  origin: string;
  resultRanking: 0 | 1 | 2 | 3;
}) => {
  const wordAndOriginRef = useRef<HTMLDivElement | null>(null);
  const { belowCutoff } = useWidthObserver({
    ref: wordAndOriginRef,
    cutoff: 200,
  });

  return (
    <h3
      aria-labelledby="top-bar-for-derived-example-text-headword-from-text"
      className="text-[150%] w-full flex flex-row gap-4 items-center justify-start"
    >
      <div
        ref={wordAndOriginRef}
        className={`flex-grow-0 flex-shrink flex-${belowCutoff ? "col" : "row"} gap-2 text-ellipsis whitespace-nowrap overflow-hidden`}
      >
        <PanelSpecificDispatcher
          panelStateAction={{
            type: "push_korean_detail",
            target_code: wordTargetCode,
          }}
        >
          <DetailViewLinkStyler>
            <span title={word} className="text-[color:--accent-1]">
              {word}
            </span>
          </DetailViewLinkStyler>
        </PanelSpecificDispatcher>
        {origin && <StringWithHanja string={origin} />}
      </div>
      <div className="w-4 flex-none justify-center items-center">
        <ResultRankingStars numStars={resultRanking} widthAndHeightPx={16} />
      </div>
    </h3>
  );
};

const FirstSensePreview = ({
  firstSenseData,
}: {
  firstSenseData: SenseInKoreanExampleType;
}) => {
  return (
    <p className="whitespace-nowrap overflow-hidden text-ellipsis">
      {firstSenseData.definition}
    </p>
  );
};

const FindHeadwordInTextButton = ({
  eojeolNumberInSourceText,
}: {
  eojeolNumberInSourceText: number;
}) => {
  const { highlightEojeol } = useDerivedExampleTextContext();

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    highlightEojeol(eojeolNumberInSourceText);
  };

  return (
    <button className="flex justify-center items-center" onClick={onClick}>
      <TextSearch />
    </button>
  );
};
