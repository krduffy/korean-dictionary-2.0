import { StringWithHanja } from "../../shared/formatted-string/StringWithHanja";
import { memo, useEffect, useRef } from "react";
import { DetailedKoreanType } from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { DetailedSenseType } from "@repo/shared/types/views/dictionary-items/senseDictionaryItems";
import {
  DetailedSenseDropdownState,
  KoreanDetailInteractionData,
} from "@repo/shared/types/views/interactionDataTypes";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { KoreanWordKnownStudiedTogglers } from "../../shared/known-studied/KnownStudiedDisplayers";
import { KoreanHistoryInfoSection } from "./KoreanHistoryInfo";
import { DetailedSenseView } from "./detailed-sense-components/DetailedSenseView";
import { ErrorMessage } from "../../../../text-formatters/messages/ErrorMessage";
import { ResultRankingStars } from "../../shared/ResultRankingStars";
import { useWidthObserver } from "../../../../../shared-web-hooks/useWidthObserver";

export const KoreanDetailDisplay = memo(
  ({
    data,
    interactionData,
  }: {
    data: DetailedKoreanType;
    interactionData: KoreanDetailInteractionData;
  }) => {
    return (
      <div>
        <KoreanDetailTopInfo data={data} />

        <DetailedSenses
          senses={data.senses}
          dropdownStates={interactionData.detailedSenseDropdowns}
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
          <KoreanWordKnownStudiedTogglers
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

const DetailedSenses = ({
  senses,
  dropdownStates,
}: {
  senses: DetailedSenseType[];
  dropdownStates: DetailedSenseDropdownState[];
}) => {
  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  useEffect(() => {
    if (senses.length !== dropdownStates.length) {
      panelDispatchStateChangeSelf({
        type: "update_detailed_sense_dropdown_states_length",
        newLength: senses.length,
      });
    }
  }, []);

  return senses.map((senseData, id) => {
    if (dropdownStates[id] === undefined) {
      return (
        <ErrorMessage
          key={senseData.target_code}
          error="뜻풀이 데이터는 구조가 안 됩니다."
        />
      );
    }
    return (
      <div key={senseData.target_code} className="mb-4">
        <DetailedSenseView
          senseData={senseData}
          dropdownState={dropdownStates[id]}
        />
      </div>
    );
  });
};
