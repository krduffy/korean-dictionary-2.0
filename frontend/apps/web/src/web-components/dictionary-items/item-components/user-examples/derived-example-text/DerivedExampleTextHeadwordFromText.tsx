import { DerivedExampleTextHeadwordFromTextType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import React from "react";
import { ResultRankingStars } from "../../shared/ResultRankingStars";
import { StringWithHanja } from "../../shared/formatted-string/StringWithHanja";
import { PanelSpecificDispatcher } from "../../../../pages/dictionary-page/PanelSpecificDispatcher";
import { DetailViewLinkStyler } from "../../../../text-formatters/SpanStylers";
import { SenseInKoreanExampleType } from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { useDerivedExampleTextContext } from "./DerivedExampleTextContext";

export const DerivedExampleTextHeadwordFromText = ({
  result,
}: {
  result: DerivedExampleTextHeadwordFromTextType;
}) => {
  return (
    <article className="max-w-full overflow-hidden">
      <TopBar
        word={result.headword_ref.word}
        wordTargetCode={result.headword_ref.target_code}
        origin={result.headword_ref.origin}
        resultRanking={result.headword_ref.result_ranking}
      />
      <FirstSensePreview firstSenseData={result.headword_ref.first_sense} />
      <FindHeadwordInTextButton
        eojeolNumberInSourceText={result.eojeol_number_in_source_text}
      />
    </article>
  );
};

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
  return (
    <h3 className="text-[150%] flex flex-row gap-4 items-center">
      <div className="flex flex-row gap-2">
        <PanelSpecificDispatcher
          panelStateAction={{
            type: "push_korean_detail",
            target_code: wordTargetCode,
          }}
        >
          <DetailViewLinkStyler>
            <span className="text-[color:--accent-1]">{word}</span>
          </DetailViewLinkStyler>
        </PanelSpecificDispatcher>
        {origin && <StringWithHanja string={origin} />}
      </div>
      <div className="flex justify-center items-center">
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

  return <button onClick={onClick}>GO TO LEMMA IN TEXT</button>;
};
