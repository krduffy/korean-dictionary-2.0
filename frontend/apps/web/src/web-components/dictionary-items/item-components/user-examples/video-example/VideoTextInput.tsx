import { UserVideoExampleType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { useId } from "react";

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
    <div>
      <label htmlFor={id}>쪽지</label>
      <textarea id={id} value={videoText} onChange={onChange} />
    </div>
  );
};
