import { UserImageExampleType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { useWidthObserver } from "../../../../../shared-web-hooks/useWidthObserver";
import { useRef } from "react";
import { DeleteAndSaveButtons } from "../DeleteAndSaveButtons";
import { SourceInput } from "../../../../forms/input-components/SourceInput";
import { AccompanyingTextInput } from "../AccompanyingTextInput";
import { ImagePreview } from "../../../../forms/input-components/ImagePreview";
import { FileUploadField } from "../../../../forms/input-components/FileUploadField";

export const ListedImageComponent = ({
  data,
  changeField,
  saveFunction,
  deleteFunction,
}: {
  data: Omit<UserImageExampleType, "id">;
  changeField: <Field extends keyof UserImageExampleType>(
    field: Field,
    newValue: UserImageExampleType[Field]
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
      <div className="flex flex-col gap-4">
        <ImagePreview image={data.image_url} />
        <DeleteAndSaveButtons
          saveFunction={saveFunction}
          deleteFunction={deleteFunction}
        />
      </div>
    </div>
  );
};

const EditableFields = ({
  data,
  changeField,
}: {
  data: Omit<UserImageExampleType, "id">;
  changeField: <Field extends keyof UserImageExampleType>(
    field: Field,
    newValue: UserImageExampleType[Field]
  ) => void;
}) => {
  return (
    <form className="flex flex-col gap-4" encType="multipart/form-data">
      <SourceInput
        source={data.source}
        onChange={(newSource: string) => changeField("source", newSource)}
      />
      <FileUploadField
        label={"이미지"}
        onChange={(newFile: File) => {
          changeField("image_url", newFile);
        }}
        accept=".png, .jpg, .jpeg, .gif"
        required={true}
      />
      <AccompanyingTextInput
        text={data.image_accompanying_text || ""}
        onChange={(newText: string) =>
          changeField("image_accompanying_text", newText)
        }
      />
    </form>
  );
};
