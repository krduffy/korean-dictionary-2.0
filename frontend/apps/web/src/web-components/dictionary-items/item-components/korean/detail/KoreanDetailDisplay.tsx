import { StringWithHanja } from "../../shared/formatted-string/StringWithHanja";
import { memo, useEffect } from "react";
import { DetailedKoreanType } from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { DetailedSenseType } from "@repo/shared/types/views/dictionary-items/senseDictionaryItems";
import {
  DetailedSenseDropdownState,
  KoreanDetailInteractionData,
} from "@repo/shared/types/views/interactionDataTypes";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { KoreanWordTogglers } from "../../shared/known-studied/KnownStudiedTogglers";
import { KoreanHistoryInfoSection } from "./KoreanHistoryInfo";
import { DetailedSenseView } from "./detailed-sense-components/DetailedSenseView";
import { ErrorMessage } from "../../../../text-formatters/ErrorMessage";

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
          errorResponse={{ detail: "this sense errored" }}
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
