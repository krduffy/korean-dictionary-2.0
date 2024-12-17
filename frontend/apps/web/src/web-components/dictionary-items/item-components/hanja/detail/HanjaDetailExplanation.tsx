import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { DetailViewBaseDefaultHideableDropdownNoTruncation } from "../../shared/ReusedFormatters";

export const HanjaDetailExplanation = ({
  explanation,
  droppedDown,
}: {
  explanation: string;
  droppedDown: boolean;
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
    <DetailViewBaseDefaultHideableDropdownNoTruncation
      title="설명"
      droppedDown={droppedDown}
      onDropdownStateToggle={onDropdownStateToggle}
    >
      <div>{explanation}</div>
    </DetailViewBaseDefaultHideableDropdownNoTruncation>
  );
};
