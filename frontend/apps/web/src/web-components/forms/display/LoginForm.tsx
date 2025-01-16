import { tokenHandlers } from "../../../shared-web-hooks/tokenHandlers";
import { useCallAPIWeb } from "../../../shared-web-hooks/useCallAPIWeb";
import { useLoginForm } from "@repo/shared/hooks/auth/useLoginForm";
import { FormResultInfoArea } from "../FormResultInfoArea";
import { LoginSuccessComponent } from "../success-components/LoginSuccessComponent";
import { Eye, EyeOff } from "lucide-react";
import { ReactNode, useState } from "react";
import { Button } from "../../ui/Button";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const { requestState, formData, postForm, updateField } = useLoginForm({
    useCallAPIInstance: useCallAPIWeb({ cacheResults: false }),
    tokenHandlers: tokenHandlers,
  });

  return (
    <form
      className="flex flex-col justify-center items-center w-full"
      onSubmit={postForm}
    >
      <div className="w-full px-16 flex flex-row justify-between items-center flex-1">
        <div className="">
          <InputBoxes
            username={String(formData.username)}
            password={String(formData.password)}
            updateField={updateField}
          />
        </div>
        <div className="text-nowrap flex flex-col gap-4 items-start justify-between">
          <LoginButton />
          <MakeNewAccountButton />
        </div>
      </div>
      <FormResultInfoArea
        requestState={requestState}
        SuccessComponent={LoginSuccessComponent}
      />
    </form>
  );
};

const MakeNewAccountButton = () => {
  const navigate = useNavigate();

  const onClick = () => navigate("/create-account");

  return (
    <Button type="button" onClick={onClick}>
      계정 만들기
    </Button>
  );
};

const InputBoxes = ({
  username,
  password,
  updateField,
}: {
  username: string;
  password: string;
  updateField: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="flex flex-col gap-12 justify-center items-center w-full">
      <InputWithLabel formDataName="username" displayedLabel="아이디">
        <UsernameInput value={username} updateField={updateField} />
      </InputWithLabel>
      <InputWithLabel formDataName="password" displayedLabel="비밀번호">
        <PasswordInput value={password} updateField={updateField} />
      </InputWithLabel>
    </div>
  );
};

const InputWithLabel = ({
  formDataName,
  displayedLabel,
  children,
}: {
  formDataName: string;
  displayedLabel: string;
  children: ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <label className="text-nowrap" htmlFor={formDataName}>
        {displayedLabel}:
      </label>
      {children}
    </div>
  );
};

const UsernameInput = ({
  value,
  updateField,
}: {
  value: string;
  updateField: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <InputBox
      value={value}
      inputType="text"
      formDataName="username"
      addAdditionalRightPadding={false}
      updateField={updateField}
    />
  );
};

const PasswordInput = ({
  value,
  updateField,
}: {
  value: string;
  updateField: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [inputType, setInputType] = useState<"password" | "text">("password");

  return (
    <div
      className="relative h-full w-full rounded-lg 
                    bg-[color:--background-secondary]
                    flex flex-row gap-4 min-h-8 items-center"
    >
      <div className="flex-1">
        <InputBox
          value={value}
          inputType={inputType}
          formDataName="password"
          addAdditionalRightPadding={true}
          updateField={updateField}
        />
      </div>
      <div className="absolute right-4 z-50 flex-none h-full flex flex-col justify-center items-center">
        <PasswordToggleVisibilityButton
          inputType={inputType}
          setInputType={setInputType}
        />
      </div>
    </div>
  );
};

const PasswordToggleVisibilityButton = ({
  inputType,
  setInputType,
}: {
  inputType: "password" | "text";
  setInputType: (newInputType: "password" | "text") => void;
}) => {
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    /* to prevent submission of form on click. */
    e.preventDefault();

    if (inputType === "password") setInputType("text");
    else setInputType("password");
  };

  return (
    <button onClick={onClick}>
      {inputType === "password" ? <Eye /> : <EyeOff />}
    </button>
  );
};

const InputBox = ({
  value,
  inputType,
  formDataName,
  addAdditionalRightPadding,
  updateField,
}: {
  value: string;
  inputType: string;
  formDataName: string;
  addAdditionalRightPadding: boolean;
  updateField: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <input
      className={`h-full w-full ${addAdditionalRightPadding ? "pr-12" : "pr-4"} px-4 py-2 
                bg-[color:--neutral-color-not-hovering]
                border border-[color:--border-color]
                rounded-full
                outline-none text-[color:--text-primary]
                focus:ring-2 focus:border-[color:--focus-blue]
                hover:bg-[color:--neutral-color-hovering]
                transition-all duration-200`}
      type={inputType}
      name={formDataName}
      id={formDataName}
      value={value}
      onChange={updateField}
      required
    />
  );
};

const LoginButton = () => {
  return <Button type="submit">로그인</Button>;
};
