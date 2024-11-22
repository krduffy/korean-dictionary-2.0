import { useForm } from "./useForm";
import { getEndpoint } from "../utils/apiAliases";
import {
  AuthTokens,
  TokenHandlers,
  UseCallAPIReturns,
} from "../types/apiCallTypes";

/* Calls the callAPI's token setter on success. */
export const useLoginForm = ({
  useCallAPIInstance,
  tokenHandlers,
}: {
  useCallAPIInstance: UseCallAPIReturns;
  tokenHandlers: TokenHandlers;
}) => {
  const {
    successful,
    error,
    loading,
    response,
    formData,
    postForm,
    updateField,
  } = useForm({
    url: getEndpoint({ endpoint: "login" }),
    initialFormData: {
      username: "",
      password: "",
    },
    useCallAPIInstance: useCallAPIInstance,
    includeCredentials: true,
  });

  const updatedPost = async (e: React.FormEvent) => {
    await postForm(e);
    if (response !== null) {
      const authTokens: AuthTokens = {
        access: response.access,
        refresh: response.refresh,
      } as AuthTokens;

      tokenHandlers.saveTokens(authTokens);
    }
  };

  return {
    successful,
    error,
    loading,
    response,
    formData,
    postForm: updatedPost,
    updateField,
  };
};
