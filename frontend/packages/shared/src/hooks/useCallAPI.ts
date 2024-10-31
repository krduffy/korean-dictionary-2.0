"use client";

import { useState } from "react";
import {
  AuthTokens,
  UseCallAPIArgs,
  UseCallAPIReturns,
  RequestConfig,
} from "../types/apiCallTypes";

export const useCallAPI = <T = any>({
  url,
  tokenHandlers,
  onRefreshFail,
}: UseCallAPIArgs): UseCallAPIReturns<T> => {
  const [successful, setSuccessful] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<T | null>(null);

  const responseToJson = async (response: Response): Promise<T> => {
    return (await response.json()) as T;
  };

  const tryRefreshAndSave = async (): Promise<AuthTokens> => {
    const refreshed = await tokenHandlers.refreshTokens();
    if (refreshed.access) {
      await tokenHandlers.saveTokens(refreshed);
      return refreshed;
    }
    onRefreshFail();
    throw new Error("Failed to refresh tokens");
  };

  const callAPI = async (config: RequestConfig = {}): Promise<T> => {
    setSuccessful(false);
    setError(false);
    setLoading(true);

    try {
      const accessToken = await tokenHandlers.getAccessToken();
      const headers = new Headers(config.headers);

      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }

      const response = await fetch(url, {
        ...config,
        headers,
      });

      if (response.status === 403) {
        const refreshed = await tryRefreshAndSave();
        headers.set("Authorization", `Bearer ${refreshed.access}`);

        const retryResponse = await fetch(url, {
          ...config,
          headers,
        });

        if (retryResponse.ok) {
          setSuccessful(true);
        } else {
          setError(true);
        }
      } else {
        setSuccessful(response.ok);
        setError(!response.ok);
      }

      const json = await responseToJson(response);
      setResponse(json);
      return json;
    } catch (err) {
      setError(true);
      throw err instanceof Error ? err : new Error("Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    successful,
    error,
    loading,
    response,
    callAPI,
  };
};
