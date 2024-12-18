import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { DetailViewBaseDefaultHideableDropdownNoTruncation } from "../../shared/ReusedFormatters";
import { HanjaExamplesView } from "../../../api-fetchers/HanjaExamplesView";

export const HanjaDetailWordExamples = ({
  character,
  pageNum,
  droppedDown,
}: {
  character: string;
  pageNum: number;
  droppedDown: boolean;
}) => {
  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  const handleDropdownStateToggle = (isToggled: boolean) => {
    panelDispatchStateChangeSelf({
      type: "update_hanja_detail_interaction_data",
      key: "exampleWordsDroppedDown",
      newValue: isToggled,
    });
  };

  return (
    <DetailViewBaseDefaultHideableDropdownNoTruncation
      title="용례 단어"
      droppedDown={droppedDown}
      onDropdownStateToggle={handleDropdownStateToggle}
    >
      <HanjaExamplesView character={character} pageNum={pageNum} />
    </DetailViewBaseDefaultHideableDropdownNoTruncation>
  );
};
