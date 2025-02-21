import { UserVideoExampleType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { UserVideoExampleIframe } from "./UserVideoExampleIframe";
import { VideoIdInput } from "./VideoIdInput";
import { VideoStartAndEndInputs } from "./VideoStartAndEndInputs";
import { VideoTextInput } from "./VideoTextInput";
import { VideoSourceInput } from "./VideoSourceInput";

export const ListedVideoComponent = ({
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
    <div className="w-full flex flex-row gap-4">
      <div className="max-w-48">
        <UserVideoExampleIframe
          videoId={data.video_id}
          start={data.start}
          end={data.end}
        />
      </div>
      <EditableFields data={data} changeField={changeField} />
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
    <div>
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
