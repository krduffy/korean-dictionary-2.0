import { UserVideoExampleType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { useId } from "react";
import { TextAreaInput } from "../TextAreaInput";

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
    <div className="w-full flex flex-row items-center gap-4">
      <label htmlFor={id}>출처</label>
      <TextAreaInput
        id={id}
        rows={2}
        cols={15}
        value={videoSource}
        onChange={onChange}
      />
    </div>
  );
};
