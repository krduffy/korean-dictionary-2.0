import { tokenHandlers } from "../../../shared-web-hooks/tokenHandlers";
import { useCallAPIWeb } from "../../../shared-web-hooks/useCallAPIWeb";
import { useLoginForm } from "@repo/shared/hooks/useLoginForm";
import { FormResultInfoArea } from "../FormResultInfoArea";
import { LoginSuccessComponent } from "../success-components/LoginSuccessComponent";

export const LoginForm = () => {
  const { requestState, formData, postForm, updateField } = useLoginForm({
    useCallAPIInstance: useCallAPIWeb({ cacheResults: false }),
    tokenHandlers: tokenHandlers,
  });

  return (
    <form onSubmit={postForm}>
      <InputBoxes
        username={String(formData.username)}
        password={String(formData.password)}
        updateField={updateField}
      />
      <button type="submit">Login</button>
      <FormResultInfoArea
        requestState={requestState}
        SuccessComponent={LoginSuccessComponent}
      />
    </form>
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
    <>
      <div>
        <label htmlFor="username">아이디:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={updateField}
          required
        />
      </div>
      <div>
        <label htmlFor="password">비밀번호:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={updateField}
          required
        />
      </div>
    </>
  );
};
