import { useForm } from "./useForm";
import { getEndpoint } from "../utils/apiAliases";
import { TokenHandlers, UseCallAPIReturns } from "../types/apiCallTypes";

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
