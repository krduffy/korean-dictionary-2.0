import { UserImageExampleType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { useId } from "react";

export const ImageInput = ({
  changeField,
}: {
  changeField: <Field extends keyof UserImageExampleType>(
    field: Field,
    newValue: UserImageExampleType[Field]
  ) => void;
}) => {
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length < 1) {
      return;
    }

    const file = e.target.files[0];

    if (file !== undefined) {
      changeField("image_url", file);
    }
  };

  const id = useId();

  return (
    <div className="flex flex-row gap-4 items-center justify-center">
      <label htmlFor={id}>이미지</label>
      <input
        onChange={onFileChange}
        id={id}
        accept=".png, .jpg, .jpeg, .gif"
        type="file"
        required
      />
    </div>
  );
};
