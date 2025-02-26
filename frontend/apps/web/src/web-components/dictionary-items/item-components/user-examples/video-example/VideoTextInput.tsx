import { UserVideoExampleType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { useId } from "react";
import { TextAreaInput } from "../TextAreaInput";

export const VideoTextInput = ({
  videoText,
  changeField,
}: {
  videoText: string;
  changeField: <Field extends keyof UserVideoExampleType>(
    field: Field,
    newValue: UserVideoExampleType[Field]
  ) => void;
}) => {
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    changeField("video_text", e.target.value);
  };

  const id = useId();

  return (
    <div className="flex flex-row items-center gap-4">
      <label htmlFor={id}>쪽지</label>
      <TextAreaInput
        id={id}
        rows={3}
        cols={30}
        value={videoText}
        onChange={onChange}
      />
    </div>
  );
};
