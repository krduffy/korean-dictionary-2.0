import { useId } from "react";

export const FileUploadField = ({
  label,
  onChange,
  accept,
  required,
}: {
  label: string;
  onChange: (newFile: File) => void;
  accept: string;
  required: boolean;
}) => {
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length < 1) {
      return;
    }

    const newFile = e.target.files[0];

    if (newFile !== undefined) {
      onChange(newFile);
    }
  };

  const id = useId();

  return (
    <div className="w-full flex flex-row items-center gap-4">
      <label htmlFor={id}>{label}</label>
      <input
        onChange={onFileChange}
        id={id}
        accept={accept}
        type="file"
        required={required}
      />
    </div>
  );
};
