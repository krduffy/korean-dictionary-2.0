import { UserExampleSentenceType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { useWidthObserver } from "../../../../../shared-web-hooks/useWidthObserver";
import { useRef } from "react";
import { DeleteAndSaveButtons } from "../DeleteAndSaveButtons";
import { SourceInput } from "../../../../forms/input-components/SourceInput";
import { SentenceInputArea } from "./SentenceInputArea";

export const ListedSentenceComponent = ({
  data,
  changeField,
  saveFunction,
  deleteFunction,
}: {
  data: Omit<UserExampleSentenceType, "id">;
  changeField: <Field extends keyof UserExampleSentenceType>(
    field: Field,
    newValue: UserExampleSentenceType[Field]
  ) => void;
  saveFunction: () => void;
  deleteFunction: () => void;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { belowCutoff } = useWidthObserver({
    ref: ref,
    cutoff: 600,
  });

  return (
    <div
      ref={ref}
      className={`w-full flex flex-${belowCutoff ? "col" : "row"} gap-8 items-center justify-center`}
    >
      <EditableFields data={data} changeField={changeField} />
      <DeleteAndSaveButtons
        saveFunction={saveFunction}
        deleteFunction={deleteFunction}
      />
    </div>
  );
};

const EditableFields = ({
  data,
  changeField,
}: {
  data: Omit<UserExampleSentenceType, "id">;
  changeField: <Field extends keyof UserExampleSentenceType>(
    field: Field,
    newValue: UserExampleSentenceType[Field]
  ) => void;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <SentenceInputArea sentence={data.sentence} changeField={changeField} />
      <SourceInput
        source={data.source}
        onChange={(newSource: string) => changeField("source", newSource)}
      />
    </div>
  );
};
