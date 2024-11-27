import { useEffect } from "react";
import {
  FormDataState,
  RequestConfig,
  UseCallAPIReturns,
} from "../types/apiCallTypes";
import { useShowFallback } from "./useShowFallback";
import { FALLBACK_MIN_TIME_MS, FALLBACK_MAX_TIME_MS } from "../constants";

export type UsePropFormArgs = {
  url: string;
  formDataGetter: () => FormDataState;
  useCallAPIInstance: UseCallAPIReturns;
  repostDependencies: any[];
};

export const usePropForm = ({
  url,
  formDataGetter,
  useCallAPIInstance,
  repostDependencies,
}: UsePropFormArgs) => {
  const { successful, error, loading, response, callAPI } = useCallAPIInstance;

  const { showFallback, resetFallbackTimers } = useShowFallback({
    loading,
    successful,
    fallbackMinTimeMs: FALLBACK_MIN_TIME_MS,
    fallbackMaxTimeMs: FALLBACK_MAX_TIME_MS,
  });

  const doPost = async () => {
    const config: RequestConfig = {
      method: "POST",
      body: JSON.stringify(formDataGetter()),
      headers: {
        "Content-Type": "application/json",
      },
    };

    return await callAPI(url, config);
  };

  useEffect(() => {
    resetFallbackTimers();
    doPost();
  }, repostDependencies);

  return {
    successful,
    error,
    loading: loading || showFallback,
    response,
  };
};
