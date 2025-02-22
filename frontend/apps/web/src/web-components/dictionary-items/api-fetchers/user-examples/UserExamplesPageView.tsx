import { KoreanUserExampleEditInteractionData } from "@repo/shared/types/views/interactionDataTypes";
import { VideoUserExamplesView } from "./VideoUserExamplesView";

export const UserExamplesPageView = ({
  headwordTargetCode,
  interactionData,
}: {
  headwordTargetCode: number;
  interactionData: KoreanUserExampleEditInteractionData;
}) => {
  return (
    <VideoUserExamplesView
      headwordTargetCode={headwordTargetCode}
      droppedDown={interactionData.videosDroppedDown}
    />
  );
};
