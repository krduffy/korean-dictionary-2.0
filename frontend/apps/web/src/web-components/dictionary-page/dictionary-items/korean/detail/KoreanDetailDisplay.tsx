import { DetailedSenseView } from "./DetailedSenseView";
import { StringWithHanja } from "../../../../other/string-formatters/StringWithHanja";
import { KoreanHistoryInfoSection } from "./KoreanHistoryInfo";
import { memo } from "react";
import { KoreanWordTogglers } from "../../known-studied/KnownStudiedTogglers";
import { DetailedKoreanType } from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { DetailedSenseType } from "@repo/shared/types/views/dictionary-items/senseDictionaryItems";
import {
  DetailedSenseDropdownState,
  KoreanDetailInteractionData,
} from "@repo/shared/types/views/interactionDataTypes";
import { ErrorMessage } from "../../../../../web-components/other/misc/ErrorMessage";

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
        <div className="mb-6 flex flex-row justify-between items-center">
          <div className="flex flex-row gap-6 items-center">
            <div className="text-[250%]">{data.word}</div>
            <div className="text-[190%]">
              <StringWithHanja string={data.origin} />
            </div>
          </div>

          {data.user_data && (
            <div>
              <KoreanWordTogglers
                pk={data.target_code}
                initiallyKnown={data.user_data.is_known}
                initiallyStudied={data.user_data.is_studied}
              />
            </div>
          )}
        </div>

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

const DetailedSenses = ({
  senses,
  dropdownStates,
}: {
  senses: DetailedSenseType[];
  dropdownStates: DetailedSenseDropdownState[];
}) => {
  return senses.map((senseData, id) => {
    if (dropdownStates[id] === undefined) {
      return <ErrorMessage errorResponse={{ detail: "this sense errored" }} />;
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
