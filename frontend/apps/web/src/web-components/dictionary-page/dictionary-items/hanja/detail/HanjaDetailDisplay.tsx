import { memo } from "react";
import { HanjaDetailDisplayTopInfo } from "./HanjaDetailDisplayTopInfo";
import { HideableDropdownNoTruncation } from "../../ReusedFormatters";
import { HanjaDetailWordExamples } from "./HanjaDetailWordExamples";
import { DetailedHanjaType } from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";
import { HanjaDetailInteractionData } from "@repo/shared/types/views/interactionDataTypes";
import { useViewDispatchersContext } from "../../../../../web-contexts/ViewDispatchersContext";

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
            initiallyDroppedDown={interactionData.explanationDroppedDown}
          />
        )}
        <HanjaDetailWordExamples
          character={data.character}
          pageNum={interactionData.exampleWordsPageNum}
          initiallyDroppedDown={interactionData.exampleWordsDroppedDown}
        />
      </>
    );
  }
);

const HanjaExplanation = ({
  explanation,
  initiallyDroppedDown,
}: {
  explanation: string;
  initiallyDroppedDown: boolean;
}) => {
  const { dispatch } = useViewDispatchersContext();

  return (
    <HideableDropdownNoTruncation
      title="설명"
      initiallyDroppedDown={initiallyDroppedDown}
      onDropdownStateToggle={(isToggled: boolean) => {
        /*dispatch({
          type: "update_hanja_detail_interaction_data",
          key: "explanationDroppedDown",
          value: isToggled,
        });*/
      }}
    >
      <div>{explanation}</div>
    </HideableDropdownNoTruncation>
  );
};
