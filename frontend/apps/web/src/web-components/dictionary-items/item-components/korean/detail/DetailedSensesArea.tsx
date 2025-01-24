import { useEffect } from "react";
import { DetailedSenseType } from "@repo/shared/types/views/dictionary-items/senseDictionaryItems";
import { DetailedSenseDropdownState } from "@repo/shared/types/views/interactionDataTypes";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { DetailedSenseView } from "./detailed-sense-components/DetailedSenseView";
import { ErrorMessage } from "../../../../text-formatters/messages/ErrorMessage";
import { TopLevelHideableDropdownNoTruncation } from "../../shared/ReusedFormatters";

export const DetailedSensesArea = ({
  senses,
  sensesDroppedDown,
  dropdownStates,
}: {
  senses: DetailedSenseType[];
  sensesDroppedDown: boolean;
  dropdownStates: DetailedSenseDropdownState[];
}) => {
  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  const onDropdownStateToggle = (newIsDroppedDown: boolean) => {
    panelDispatchStateChangeSelf({
      type: "update_korean_detail_interaction_data",
      key: "sensesDroppedDown",
      newValue: newIsDroppedDown,
    });
  };

  return (
    <TopLevelHideableDropdownNoTruncation
      title={"뜻풀이"}
      droppedDown={sensesDroppedDown}
      onDropdownStateToggle={onDropdownStateToggle}
    >
      <ListedDetailedSenses senses={senses} dropdownStates={dropdownStates} />
    </TopLevelHideableDropdownNoTruncation>
  );
};

const ListedDetailedSenses = ({
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

  return (
    <div className="flex flex-col gap-4" aria-label="detailed-senses-wrapper">
      {senses.map((senseData, id) => {
        if (dropdownStates[id] === undefined) {
          return (
            <ErrorMessage
              key={senseData.target_code}
              error="뜻풀이 데이터는 구조가 안 됩니다."
            />
          );
        }
        return (
          <article key={id} aria-label="detailed-sense">
            <DetailedSenseView
              senseData={senseData}
              dropdownState={dropdownStates[id]}
            />
          </article>
        );
      })}
    </div>
  );
};
