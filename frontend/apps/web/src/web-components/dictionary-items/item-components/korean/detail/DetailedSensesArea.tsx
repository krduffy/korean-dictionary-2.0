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
    /* In theory it should always be true that the senses' orders are in order
       from 1 to (senses.length - 1) but I've seen (once) gaps where a number is 
       missing. The highest sense order dictates the new length of the array
       to prevent the dropdowns from breaking in any such other malformed case */
    const highestSenseOrder: number = senses.reduce(
      (highest, current) => Math.max(highest, current.order),
      0
    );

    if (highestSenseOrder !== dropdownStates.length) {
      panelDispatchStateChangeSelf({
        type: "update_detailed_sense_dropdown_states_length",
        newLength: highestSenseOrder,
      });
    }
  }, []);

  return (
    <div className="flex flex-col gap-4" aria-label="detailed-senses-wrapper">
      {senses.map((senseData, id) => {
        const dropdownStatesId = senseData.order - 1;

        if (dropdownStates[dropdownStatesId] === undefined) {
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
              dropdownState={dropdownStates[dropdownStatesId]}
            />
          </article>
        );
      })}
    </div>
  );
};
