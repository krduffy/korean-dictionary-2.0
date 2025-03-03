import { useId } from "react";
import { TextAreaInput } from "../../../forms/input-components/TextAreaInput";

export const AccompanyingTextInput = ({
  text,
  onChange,
}: {
  text: string;
  onChange: (newText: string) => void;
}) => {
  const id = useId();

  return (
    <div className="flex flex-row items-center gap-4">
      <label htmlFor={id}>쪽지</label>
      <TextAreaInput
        id={id}
        rows={3}
        cols={30}
        value={text}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
      />
    </div>
  );
};
