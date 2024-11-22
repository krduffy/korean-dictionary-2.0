import { PageWithNavBar } from "../web-components/navbar/PageWithNavBar";
import { useLoginForm } from "@repo/shared/hooks/useLoginForm";
import { useCallAPIWeb } from "../web-hooks/useCallAPIWeb";
import { tokenHandlers } from "../web-hooks/tokenHandlers";

export const LoginPage = () => {
  return (
    <PageWithNavBar>
      <LoginForm />
    </PageWithNavBar>
  );
};

const LoginForm = () => {
  const {
    successful,
    error,
    loading,
    response,
    formData,
    postForm,
    updateField,
  } = useLoginForm({
    useCallAPIInstance: useCallAPIWeb({ cacheResults: false })
      .useCallAPIReturns,
    tokenHandlers: tokenHandlers,
  });

  return (
    <form onSubmit={postForm}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={updateField}
          required
        />
      </div>
      <div>
        <label htmlFor="password">password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={updateField}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};
