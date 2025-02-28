import { KoreanUserExampleEditInteractionData } from "@repo/shared/types/views/interactionDataTypes";
import { VideoUserExamplesView } from "./VideoUserExamplesView";
import { SentenceUserExamplesView } from "./SentenceUserExamplesView";
import { ImageUserExamplesView } from "./ImageUserExamplesView";

export const UserExamplesPageView = ({
  headword,
  headwordTargetCode,
  interactionData,
}: {
  headword: string;
  headwordTargetCode: number;
  interactionData: KoreanUserExampleEditInteractionData;
}) => {
  return (
    <div className="flex flex-col gap-6">
      <UserExamplesPageTopBar headword={headword} />

      <div className="flex flex-col gap-12">
        <SentenceUserExamplesView
          headwordTargetCode={headwordTargetCode}
          droppedDown={interactionData.sentencesDroppedDown}
        />
        <VideoUserExamplesView
          headwordTargetCode={headwordTargetCode}
          droppedDown={interactionData.videosDroppedDown}
        />
        <ImageUserExamplesView
          headwordTargetCode={headwordTargetCode}
          droppedDown={interactionData.imagesDroppedDown}
        />
      </div>
    </div>
  );
};

const UserExamplesPageTopBar = ({ headword }: { headword: string }) => {
  return (
    <h1 className="w-full text-center text-[200%]">
      '{headword}' 추가한 용례 수정
    </h1>
  );
};
