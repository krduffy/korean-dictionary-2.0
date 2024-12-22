import { memo } from "react";
import { HanjaDetailDisplayTopInfo } from "./HanjaDetailDisplayTopInfo";
import { HanjaDetailWordExamples } from "./HanjaDetailWordExamples";
import { DetailedHanjaType } from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";
import { HanjaDetailInteractionData } from "@repo/shared/types/views/interactionDataTypes";
import { HanjaDetailExplanation } from "./HanjaDetailExplanation";

export const HanjaDetailDisplay = memo(
  ({
    data,
    interactionData,
  }: {
    data: DetailedHanjaType;
    interactionData: HanjaDetailInteractionData;
  }) => {
    return (
      <div className="flex flex-col gap-4">
        <HanjaDetailDisplayTopInfo data={data} />
        {data.explanation && (
          <HanjaDetailExplanation
            character={data.character}
            explanation={data.explanation}
            droppedDown={interactionData.explanationDroppedDown}
          />
        )}
        <HanjaDetailWordExamples
          character={data.character}
          pageNum={interactionData.exampleWordsPageNum}
          droppedDown={interactionData.exampleWordsDroppedDown}
        />
      </div>
    );
  }
);
