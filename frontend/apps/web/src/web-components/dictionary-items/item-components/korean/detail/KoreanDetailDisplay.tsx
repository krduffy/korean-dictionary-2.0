import { StringWithHanja } from "../../shared/formatted-string/StringWithHanja";
import { memo, useRef } from "react";
import {
  DetailedKoreanType,
  UserExamplesType,
} from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import {
  KoreanDetailInteractionData,
  KoreanDetailUserExampleDropdownState,
} from "@repo/shared/types/views/interactionDataTypes";
import { KoreanHeadwordKnownStudiedTogglers } from "../../shared/known-studied/KnownStudiedDisplayers";
import { KoreanHistoryInfoSection } from "./KoreanHistoryInfo";
import { ResultRankingStars } from "../../shared/ResultRankingStars";
import { useWidthObserver } from "../../../../../shared-web-hooks/useWidthObserver";
import { UserExamplesArea } from "./user-examples/UserExamplesArea";
import { DetailedSensesArea } from "./DetailedSensesArea";
import { DerivedLemmaExamplesArea } from "./user-examples/DerivedLemmaExamplesArea";
import { useLoginStatusContext } from "@repo/shared/contexts/LoginStatusContextProvider";

export const KoreanDetailDisplay = memo(
  ({
    data,
    interactionData,
  }: {
    data: DetailedKoreanType;
    interactionData: KoreanDetailInteractionData;
  }) => {
    return (
      <div className="flex flex-col gap-4" aria-label="korean-detail-display">
        <KoreanDetailTopInfo data={data} />

        <UserExamplesAreaIfPresent
          userExamples={data.user_examples}
          userExampleDropdowns={interactionData.userExampleDropdowns}
        />

        <DetailedSensesArea
          senses={data.senses}
          sensesDroppedDown={interactionData.sensesDroppedDown}
          dropdownStates={interactionData.detailedSenseDropdowns}
        />

        <DerivedLemmaExamplesAreaIfPresent
          droppedDown={interactionData.derivedLemmasDroppedDown}
          headwordPk={data.target_code}
          pageNum={interactionData.derivedLemmasPageNum}
        />

        {data.history_info && (
          <KoreanHistoryInfoSection
            historyInfo={data.history_info}
            dropdownState={interactionData.historyDroppedDown}
          />
        )}
      </div>
    );
  }
);

const DerivedLemmaExamplesAreaIfPresent = ({
  droppedDown,
  headwordPk,
  pageNum,
}: {
  droppedDown: boolean;
  headwordPk: number;
  pageNum: number;
}) => {
  const { loggedInAs } = useLoginStatusContext();

  if (loggedInAs === null) return;

  return (
    <DerivedLemmaExamplesArea
      droppedDown={droppedDown}
      headwordPk={headwordPk}
      pageNum={pageNum}
    />
  );
};

const UserExamplesAreaIfPresent = ({
  userExamples,
  userExampleDropdowns,
}: {
  userExamples: UserExamplesType | null;
  userExampleDropdowns: KoreanDetailUserExampleDropdownState;
}) => {
  return (
    userExamples !== null &&
    (
      [
        "user_example_sentences",
        "user_image_examples",
        "user_video_examples",
      ] as const
    ).some(
      (key) =>
        Array.isArray(userExamples?.[key]) && userExamples[key].length > 0
    ) && (
      <UserExamplesArea
        userExampleDropdowns={userExampleDropdowns}
        userExamples={userExamples}
      />
    )
  );
};

const KoreanDetailTopInfo = ({ data }: { data: DetailedKoreanType }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { belowCutoff } = useWidthObserver({
    cutoff: 400,
    ref: ref,
  });

  return (
    <div ref={ref} className="mb-6 flex flex-row justify-between items-center">
      {/* padding of 16px on right for star */}
      <div className="flex flex-row gap-4 items-center justify-center">
        <WordAndOrigin
          rowOrCol={belowCutoff ? "col" : "row"}
          word={data.word}
          origin={data.origin}
        />
        <div className="flex justify-center items-center">
          <ResultRankingStars
            numStars={data.result_ranking}
            widthAndHeightPx={32}
          />
        </div>
      </div>
      {data.user_data && (
        <div>
          <KoreanHeadwordKnownStudiedTogglers
            pk={data.target_code}
            isKnown={data.user_data.is_known}
            isStudied={data.user_data.is_studied}
          />
        </div>
      )}
    </div>
  );
};

const WordAndOrigin = ({
  rowOrCol,
  word,
  origin,
}: {
  rowOrCol: "row" | "col";
  word: string;
  origin: string;
}) => {
  return (
    <div className={`flex flex-${rowOrCol} gap-6 items-center justify-center`}>
      <div className="text-[250%]">{word}</div>
      {origin.length > 0 && (
        <div className="text-[190%]">
          <StringWithHanja string={origin} />
        </div>
      )}
    </div>
  );
};
