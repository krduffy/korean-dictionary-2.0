import { UserVideoExampleType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { useId } from "react";

export const VideoSourceInput = ({
  videoSource,
  changeField,
}: {
  videoSource: string;
  changeField: <Field extends keyof UserVideoExampleType>(
    field: Field,
    newValue: UserVideoExampleType[Field]
  ) => void;
}) => {
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    changeField("source", e.target.value);
  };

  const id = useId();

  return (
    <div>
      <label htmlFor={id}>출처</label>
      <textarea id={id} value={videoSource} onChange={onChange} />
    </div>
  );
};
