"use client";

import { useLoginForm } from "@repo/shared/hooks/useLoginForm";
import { useCallAPIWeb } from "app/web-hooks/useCallAPIWeb";
import { allTokenHandlers } from "app/web-hooks/tokenHandlers";

export const LoginForm = () => {
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
    tokenHandlers: allTokenHandlers,
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
