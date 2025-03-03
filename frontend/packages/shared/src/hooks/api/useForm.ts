import { useState } from "react";

import {
  JsonObjectType,
  RequestConfig,
  UseCallAPIReturns,
} from "../../types/apiCallTypes";

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

  const { requestState, callAPI } = useCallAPIInstance;

  const doPost = async (formDataToPost: JsonObjectType) => {
    const formDataObject = new FormData();
    for (const [k, v] of Object.entries(formDataToPost)) {
      formDataObject.append(k, v as any);
    }

    const config: RequestConfig = {
      method: "POST",
      body: formDataObject,
      credentials: includeCredentials ? "include" : undefined,
    };

    return await callAPI(url, config);
  };

  const postForm = async (e: React.FormEvent) => {
    e.preventDefault();
    doPost(formData);
  };

  const updateField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };

    setFormData(newFormData);
  };

  const setFieldDirectly = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const deleteFieldThenPost = (
    e: React.FormEvent<HTMLFormElement>,
    key: string
  ) => {
    e.preventDefault();

    const newFormData = {
      ...formData,
    };
    delete newFormData[key];

    setFormData(newFormData);
    doPost(newFormData);
  };

  return {
    requestState,
    formData,
    postForm,
    updateField,
    setFieldDirectly,
    deleteFieldThenPost,
  };
};
