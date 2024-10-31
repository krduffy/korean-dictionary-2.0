import { useForm } from "./useForm";
import { getEndpoint } from "../utils/apiAliases";
import {
  InvokablePlatformUseCallAPIHook,
  TokenHandlers,
} from "../types/apiCallTypes";

/* Calls the callAPI's token setter on success. */
export const useLoginForm = ({
  invokablePlatformUseCallAPIHook,
  tokenHandlers,
}: {
  invokablePlatformUseCallAPIHook: InvokablePlatformUseCallAPIHook;
  tokenHandlers: TokenHandlers;
}) => {
  const useCallAPI = invokablePlatformUseCallAPIHook({
    url: getEndpoint({ endpoint: "login" }),
  });

  const {
    successful,
    error,
    loading,
    response,
    formData,
    postForm,
    updateField,
  } = useForm({
    initialFormData: {
      username: "",
      password: "",
    },
    useCallAPIInstance: useCallAPI.useCallAPIReturns,
  });

  const updatedPost = async (e: React.FormEvent) => {
    const responseJson = await postForm(e);
    tokenHandlers.saveTokens(responseJson);
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
