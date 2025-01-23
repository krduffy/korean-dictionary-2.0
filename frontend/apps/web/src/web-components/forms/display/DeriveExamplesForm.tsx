import { useForm } from "@repo/shared/hooks/api/useForm";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../shared-web-hooks/useCallAPIWeb";
import { FormResultInfoArea } from "../FormResultInfoArea";
import { DeriveExamplesSuccessComponent } from "../success-components/DeriveExamplesSuccessComponent";
import { Button } from "../../ui/Button";
import React from "react";

export const DeriveExamplesForm = () => {
  const { requestState, formData, updateField, postForm } = useForm({
    url: getEndpoint({ endpoint: "derive_examples_from_text" }),
    initialFormData: {
      txt_file: null,
      source: "",
    },
    useCallAPIInstance: useCallAPIWeb({ cacheResults: false }),
  });

  return (
    <form onSubmit={postForm}>
      <FileUploadField updateField={updateField} />
      <SourceInputField
        value={String(formData.source)}
        updateField={updateField}
      />
      <FormResultInfoArea
        requestState={requestState}
        SuccessComponent={DeriveExamplesSuccessComponent}
        successComponentProps={{
          serverResponse: requestState.response,
        }}
      />
      <Button type="submit">입력</Button>
    </form>
  );
};

const FileUploadField = ({
  updateField,
}: {
  updateField: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length < 1) {
      return;
    }

    const newEvent = {
      target: {
        name: "txt_file",
        value: e.target.files[0],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    updateField(newEvent);
  };

  return (
    <input
      onChange={onFileChange}
      name="txt_file"
      id="txt_file"
      accept=".txt"
      type="file"
      required
    />
  );
};

const SourceInputField = ({
  value,
  updateField,
}: {
  value: string;
  updateField: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <input
      name="source"
      id="source"
      onChange={updateField}
      value={value}
      type="text"
      required
    />
  );
};
