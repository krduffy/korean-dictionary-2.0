import { useRef } from "react";
import { HideableDropdownNoTruncation } from "../../ReusedFormatters";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";

export const HanjaDetailExplanation = ({
  explanation,
  dropdownState,
}: {
  explanation: string;
  dropdownState: boolean;
}) => {
  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  const onDropdownStateToggle = (newValue: boolean) => {
    panelDispatchStateChangeSelf({
      type: "update_hanja_detail_interaction_data",
      key: "explanationDroppedDown",
      newValue: newValue,
    });
  };

  return (
    <HideableDropdownNoTruncation
      title="설명"
      topBarColor="red"
      childrenBackgroundColor="blue"
      droppedDown={dropdownState}
      onDropdownStateToggle={onDropdownStateToggle}
    >
      <div>{explanation}</div>
    </HideableDropdownNoTruncation>
  );
};
