import { memo } from "react";
import { HanjaDetailDisplayTopInfo } from "./HanjaDetailDisplayTopInfo";
import { HideableDropdownNoTruncation } from "../../ReusedFormatters";
import { HanjaDetailWordExamples } from "./HanjaDetailWordExamples";
import { DetailedHanjaType } from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";
import { HanjaDetailInteractionData } from "@repo/shared/types/views/interactionDataTypes";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";

export const HanjaDetailDisplay = memo(
  ({
    data,
    interactionData,
  }: {
    data: DetailedHanjaType;
    interactionData: HanjaDetailInteractionData;
  }) => {
    return (
      <>
        <HanjaDetailDisplayTopInfo data={data} />
        {data.explanation && (
          <HanjaExplanation
            explanation={data.explanation}
            droppedDown={interactionData.explanationDroppedDown}
          />
        )}
        <HanjaDetailWordExamples
          character={data.character}
          pageNum={interactionData.exampleWordsPageNum}
          droppedDown={interactionData.exampleWordsDroppedDown}
        />
      </>
    );
  }
);

const HanjaExplanation = ({
  explanation,
  droppedDown,
}: {
  explanation: string;
  droppedDown: boolean;
}) => {
  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  return (
    <HideableDropdownNoTruncation
      title="설명"
      droppedDown={droppedDown}
      onDropdownStateToggle={(isToggled: boolean) => {
        panelDispatchStateChangeSelf({
          type: "update_hanja_detail_interaction_data",
          key: "explanationDroppedDown",
          newValue: isToggled,
        });
      }}
    >
      <div>{explanation}</div>
    </HideableDropdownNoTruncation>
  );
};
