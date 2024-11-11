import { useState } from "react";
import {
  AuthTokens,
  UseCallAPIArgs,
  UseCallAPIReturns,
  RequestConfig,
} from "../types/apiCallTypes";
import { useCachingContext } from "../contexts/CachingContextProvider";
import { APIResponseType } from "./useCache";

export const useCallAPI = ({
  tokenHandlers,
  onRefreshFail,
  cacheResults,
}: UseCallAPIArgs): UseCallAPIReturns => {
  const { clear, put, retrieve } = useCachingContext();

  const [successful, setSuccessful] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<APIResponseType | null>(null);

  const responseToJson = async (
    response: Response
  ): Promise<APIResponseType> => {
    return await response.json();
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

  const callAPI = async (
    url: string,
    config: RequestConfig = {}
  ): Promise<APIResponseType> => {
    setSuccessful(false);
    setError(false);
    setLoading(true);

    /* Check for cache hit first */
    const fromCache = retrieve(url, config.body);
    if (fromCache) {
      setSuccessful(fromCache.ok);
      setError(!fromCache.ok);
      setResponse(fromCache.response);
      setLoading(false);
      return new Promise((resolve) => resolve(fromCache.response));
    }

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

      if (response.status === 401) {
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

      /* Setting cache here */
      if (cacheResults) {
        put(url, json, response.ok, config.body);
      }

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
