import { useState } from "react";

import {
  JsonObjectType,
  RequestConfig,
  UseCallAPIReturns,
} from "../types/apiCallTypes";

interface UseFormArgs {
  url: string;
  initialFormData: JsonObjectType;
  useCallAPIInstance: UseCallAPIReturns;
  includeCredentials?: boolean;
  /** Whether the form is intended to be submitted instantly. Used when
   * `initialFormData` is final and not intended to ever be updated. */
  submitOnLoad?: boolean;
  /** An array of variables that on change should automatically trigger
   * form submission. If `submitOnLoad` is not true, this will have no effect.*/
  autoResubmitDependencies?: any[];
}

export const useForm = ({
  url,
  initialFormData,
  useCallAPIInstance,
  includeCredentials = false,
}: UseFormArgs) => {
  const [formData, setFormData] = useState<JsonObjectType>(initialFormData);

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
