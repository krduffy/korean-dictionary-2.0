import { useForm } from "@repo/shared/hooks/api/useForm";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../shared-web-hooks/useCallAPIWeb";
import { FormResultInfoArea } from "../FormResultInfoArea";
import { DeriveExamplesSuccessComponent } from "../success-components/DeriveExamplesSuccessComponent";
import { Button } from "../../ui/Button";
import { FileUploadField } from "../input-components/FileUploadField";
import { SourceInput } from "../input-components/SourceInput";
import { TextAreaInput } from "../input-components/TextAreaInput";
import { useId, useState } from "react";
import { JsonObjectType } from "@repo/shared/types/apiCallTypes";
import { ImagePreview } from "../input-components/ImagePreview";

export const DeriveExamplesForm = () => {
  const { requestState, formData, setFieldDirectly, deleteFieldThenPost } =
    useForm({
      url: getEndpoint({ endpoint: "derive_examples_from_text" }),
      initialFormData: {
        ignored_headwords: "",
        text: "",
        text_file: null,
        source: "",
      },
      useCallAPIInstance: useCallAPIWeb({ cacheResults: false }),
    });

  const [inputtingTextFile, setInputtingTextFile] = useState<boolean>(true);

  return (
    <form
      className="flex flex-row gap-4"
      onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
        deleteFieldThenPost(e, inputtingTextFile ? "text" : "text_file")
      }
      encType="multipart/form-data"
    >
      <div className="w-[80%] flex flex-col gap-4">
        <InputFields
          inputtingTextFile={inputtingTextFile}
          setInputtingTextFile={setInputtingTextFile}
          formData={formData}
          setFieldDirectly={setFieldDirectly}
        />
        <FormResultInfoArea
          requestState={requestState}
          SuccessComponent={DeriveExamplesSuccessComponent}
          successComponentProps={{
            serverResponse: requestState.response,
          }}
        />
      </div>
      <div className="w-[20%]">
        <ImagePreview
          image={formData.image_url instanceof File ? formData.image_url : ""}
        />
        <Button type="submit">입력</Button>
      </div>
    </form>
  );
};

const InputFields = ({
  inputtingTextFile,
  setInputtingTextFile,
  formData,
  setFieldDirectly,
}: {
  inputtingTextFile: boolean;
  setInputtingTextFile: (newValue: boolean) => void;
  formData: JsonObjectType;
  setFieldDirectly: (key: string, newValue: any) => void;
}) => {
  return (
    <>
      <TextFileOrRawTextInputArea
        inputtingTextFile={inputtingTextFile}
        setInputtingTextFile={setInputtingTextFile}
        currentlyInputText={String(formData.text)}
        setFieldDirectly={setFieldDirectly}
      />
      <FileUploadField
        label={"이미지"}
        onChange={(newFile: File) => setFieldDirectly("image_url", newFile)}
        accept=".png, .jpg, .jpeg, .gif"
        required={false}
      />
      <SourceInput
        source={String(formData.source)}
        onChange={(newSource: string) => setFieldDirectly("source", newSource)}
      />
      <IgnoredHeadwordsInput
        ignoredHeadwords={String(formData.ignored_headwords)}
        setNewIgnoredHeadwords={(newIgnoredHeadwords: string) =>
          setFieldDirectly("ignored_headwords", newIgnoredHeadwords)
        }
      />
    </>
  );
};

const TextFileOrRawTextInputArea = ({
  inputtingTextFile,
  setInputtingTextFile,
  currentlyInputText,
  setFieldDirectly,
}: {
  inputtingTextFile: boolean;
  setInputtingTextFile: (newValue: boolean) => void;
  currentlyInputText: string;
  setFieldDirectly: (key: string, value: any) => void;
}) => {
  const textAreaId = useId();

  return (
    <div className="flex flex-row gap-4">
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          setInputtingTextFile(!inputtingTextFile);
        }}
      >
        switch
      </button>

      {inputtingTextFile ? (
        <FileUploadField
          label={"문서 파일 (.txt)"}
          onChange={(newFile: File) => setFieldDirectly("text_file", newFile)}
          accept=".txt"
          required={true}
        />
      ) : (
        <div className="flex flex-row gap-4">
          <label htmlFor={textAreaId}>문서</label>
          <TextAreaInput
            id={textAreaId}
            rows={0}
            cols={0}
            value={currentlyInputText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setFieldDirectly("text", e.target.value)
            }
          />
        </div>
      )}
    </div>
  );
};

const IgnoredHeadwordsInput = ({
  ignoredHeadwords,
  setNewIgnoredHeadwords,
}: {
  ignoredHeadwords: string;
  setNewIgnoredHeadwords: (newIgnoredHeadwords: string) => void;
}) => {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>추가하지 않을 단어</label>
      <TextAreaInput
        id={id}
        rows={2}
        cols={10}
        value={ignoredHeadwords}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setNewIgnoredHeadwords(e.target.value);
        }}
      />
    </div>
  );
};
