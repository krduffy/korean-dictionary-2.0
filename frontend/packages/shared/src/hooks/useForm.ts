"use client";

import { useState } from "react";

import { UseFormArgs, RequestConfig } from "../types/apiCallTypes";

export const useForm = ({
  initialFormData,
  useCallAPIInstance,
}: UseFormArgs) => {
  const [formData, setFormData] = useState(initialFormData);

  const { successful, error, loading, response, callAPI } = useCallAPIInstance;

  const postForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const config: RequestConfig = {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    };

    return await callAPI(config);
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
