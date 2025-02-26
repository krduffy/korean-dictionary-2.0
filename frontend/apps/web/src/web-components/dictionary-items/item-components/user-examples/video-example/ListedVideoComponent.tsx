import { UserVideoExampleType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { UserVideoExampleIframe } from "./UserVideoExampleIframe";
import { VideoIdInput } from "./VideoIdInput";
import { VideoStartAndEndInputs } from "./VideoStartAndEndInputs";
import { VideoTextInput } from "./VideoTextInput";
import { VideoSourceInput } from "./VideoSourceInput";
import { useWidthObserver } from "../../../../../shared-web-hooks/useWidthObserver";
import { useRef } from "react";
import { DeleteAndSaveButtons } from "../DeleteAndSaveButtons";

export const ListedVideoComponent = ({
  data,
  changeField,
  saveFunction,
  deleteFunction,
}: {
  data: Omit<UserVideoExampleType, "id">;
  changeField: <Field extends keyof UserVideoExampleType>(
    field: Field,
    newValue: UserVideoExampleType[Field]
  ) => void;
  saveFunction: () => void;
  deleteFunction: () => void;
}) => {
  const videoComponentRef = useRef<HTMLDivElement | null>(null);
  const { belowCutoff } = useWidthObserver({
    ref: videoComponentRef,
    cutoff: 600,
  });

  return (
    <div
      ref={videoComponentRef}
      className={`w-full flex flex-${belowCutoff ? "col" : "row"} gap-8`}
    >
      <EditableFields data={data} changeField={changeField} />
      <div className="flex items-center justify-center w-full h-full">
        <div
          className={`flex-1 gap-4 max-w-full flex flex-col ${belowCutoff ? "w-full" : "h-full"} items-center justify-center`}
        >
          <UserVideoExampleIframe
            videoId={data.video_id}
            start={data.start}
            end={data.end}
          />
          <DeleteAndSaveButtons
            saveFunction={saveFunction}
            deleteFunction={deleteFunction}
          />
        </div>
      </div>
    </div>
  );
};

const EditableFields = ({
  data,
  changeField,
}: {
  data: Omit<UserVideoExampleType, "id">;
  changeField: <Field extends keyof UserVideoExampleType>(
    field: Field,
    newValue: UserVideoExampleType[Field]
  ) => void;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <VideoIdInput videoId={data.video_id} changeField={changeField} />
      <VideoSourceInput videoSource={data.source} changeField={changeField} />
      <VideoStartAndEndInputs
        start={data.start}
        end={data.end}
        changeField={changeField}
      />
      <VideoTextInput
        videoText={data.video_text || ""}
        changeField={changeField}
      />
    </div>
  );
};
