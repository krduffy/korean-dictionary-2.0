import { useId } from "react";
import { TextAreaInput } from "./TextAreaInput";

export const SourceInput = ({
  source,
  onChange,
}: {
  source: string;
  onChange: (newSource: string) => void;
}) => {
  const id = useId();

  return (
    <div className="w-full flex flex-row items-center gap-4">
      <label htmlFor={id}>출처</label>
      <TextAreaInput
        id={id}
        rows={2}
        cols={15}
        value={source}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
};
