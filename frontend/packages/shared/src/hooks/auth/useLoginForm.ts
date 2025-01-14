import { useForm } from "../api/useForm";
import { getEndpoint } from "../../utils/apiAliases";
import {
  AuthTokens,
  TokenHandlers,
  UseCallAPIReturns,
} from "../../types/apiCallTypes";
import { useEffect } from "react";
import { useDoLoginStatusUpdate } from "./useDoLoginStatusUpdate";

/* Calls the callAPI's token setter on success. */
export const useLoginForm = ({
  useCallAPIInstance,
  tokenHandlers,
}: {
  useCallAPIInstance: UseCallAPIReturns;
  tokenHandlers: TokenHandlers;
}) => {
  const { requestState, formData, postForm, updateField } = useForm({
    url: getEndpoint({ endpoint: "login" }),
    initialFormData: {
      username: "",
      password: "",
    },
    useCallAPIInstance: useCallAPIInstance,
    includeCredentials: true,
  });

  const { doLoginStatusUpdate } = useDoLoginStatusUpdate();

  useEffect(() => {
    if (requestState.progress === "success") {
      doLoginStatusUpdate();
    }
  }, [requestState]);

  const updatedPost = async (e: React.FormEvent) => {
    await postForm(e);
    if (requestState.response !== null) {
      const authTokens: AuthTokens = {
        access: requestState.response.access,
        refresh: requestState.response.refresh,
      } as AuthTokens;

      tokenHandlers.saveTokens(authTokens);
    }
  };

  return {
    requestState,
    formData,
    postForm: updatedPost,
    updateField,
  };
};
