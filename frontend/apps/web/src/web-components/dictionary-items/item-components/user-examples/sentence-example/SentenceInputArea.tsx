import { UserExampleSentenceType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { useId, useRef, useState } from "react";
import { TextAreaInput } from "../TextAreaInput";
import { Info } from "lucide-react";
import { PopupBox } from "../../../../ui/popup-box/PopupBox";

export const SentenceInputArea = ({
  sentence,
  changeField,
}: {
  sentence: string;
  changeField: <Field extends keyof UserExampleSentenceType>(
    field: Field,
    newValue: UserExampleSentenceType[Field]
  ) => void;
}) => {
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    changeField("sentence", e.target.value);
  };

  const id = useId();

  return (
    <div className="flex flex-row items-center gap-4 justify-center">
      <div className="flex flex-col gap-4">
        <label htmlFor={id}>문장</label>
        <EmbeddedWordInfo />
      </div>
      <TextAreaInput
        id={id}
        rows={3}
        cols={30}
        value={sentence}
        onChange={onChange}
      />
    </div>
  );
};

const EmbeddedWordInfo = () => {
  const [hovering, setHovering] = useState<boolean>(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div
        ref={divRef}
        className="hover:opacity-50 transition-all flex items-center justify-center"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <Info />
      </div>
      {hovering && divRef.current && (
        <PopupBox
          relativeTo={divRef.current}
          positioning={{
            horizontalAlignment: {
              relativeHashMark: "end",
              hashMarkAlignment: "entirely-before",
            },
            verticalAlignment: {
              relativeHashMark: "end",
              hashMarkAlignment: "entirely-before",
            },
          }}
        >
          <div className="bg-[color:--background-tertiary] p-4 border-2 border-[color:--border-color] rounded-md">
            해당 단어를 {"<"}TGT{">"} {"<"}/TGT{">"} 안에 담으면 밑줄이
            그려집니다.
          </div>
        </PopupBox>
      )}
    </>
  );
};
