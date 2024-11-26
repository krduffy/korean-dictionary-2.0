import { useState } from "react";

import { UseFormArgs, RequestConfig } from "../types/apiCallTypes";

export const useForm = ({
  url,
  initialFormData,
  useCallAPIInstance,
  includeCredentials = false,
}: UseFormArgs) => {
  const [formData, setFormData] = useState(initialFormData);

  const { successful, error, loading, response, callAPI } = useCallAPIInstance;

  const doPost = async () => {
    const config: RequestConfig = {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: includeCredentials ? "include" : undefined,
    };

    return await callAPI(url, config);
  };

  const postForm = async (e: React.FormEvent) => {
    e.preventDefault();
    doPost();
  };

  const updateField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };

    setFormData(newFormData);
  };

  return {
    successful,
    error,
    loading,
    response,
    formData,
    postForm,
    updateField,
  };
};
