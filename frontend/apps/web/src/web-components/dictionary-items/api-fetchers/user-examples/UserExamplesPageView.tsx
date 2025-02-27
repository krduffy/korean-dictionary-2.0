import { KoreanUserExampleEditInteractionData } from "@repo/shared/types/views/interactionDataTypes";
import { VideoUserExamplesView } from "./VideoUserExamplesView";
import { SentenceUserExamplesView } from "./SentenceUserExamplesView";

export const UserExamplesPageView = ({
  headwordTargetCode,
  interactionData,
}: {
  headwordTargetCode: number;
  interactionData: KoreanUserExampleEditInteractionData;
}) => {
  return (
    <div className="flex flex-col gap-12">
      <SentenceUserExamplesView
        headwordTargetCode={headwordTargetCode}
        droppedDown={interactionData.sentencesDroppedDown}
      />
      <VideoUserExamplesView
        headwordTargetCode={headwordTargetCode}
        droppedDown={interactionData.videosDroppedDown}
      />
    </div>
  );
};
