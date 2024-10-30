import React, { useState } from "react";

interface AuthTokens {
  accessToken: string;
  // Optional since is http only in web
  refreshToken?: string;
}

interface TokenHandlers {
  getAccessToken: () => Promise<string>;
  refreshTokens: () => Promise<AuthTokens>;
  saveTokens: (tokens: AuthTokens) => Promise<void>;
}

interface UseCallAPIArgs {
  tokenHandlers: TokenHandlers;
  onRefreshFail: () => void;
}

export const useCallAPI = ({
  url,
  tokenHandlers,
  onRefreshFail,
}: TokenHandlers) => {
  const [successful, setSuccessful] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const responseToJson = async (response) => {
    const asJSON = await response.json();
    setResponse(asJSON);
  };

  const tryRefreshAndSave = async () => {
    const refreshed = await tokenHandlers.refreshTokens();

    if (refreshed) {
      await tokenHandlers.saveTokens(refreshed);
      return refreshed;
    } else {
      onRefreshFail();
      throw new Error("Failed to refresh tokens");
    }
  };

  const callAPI = async ({ headers }) => {
    setSuccessful(false);
    setError(false);
    setLoading(true);

    /* 1 */
    try {
      const accessToken = await tokenHandlers.getAccessToken();

      const headers = new Headers();
      if (accessToken) {
        headers.append("Authorization", `Bearer ${accessToken}`);
      }

      const response = await fetch(url, headers);

      if (response.status === 403) {
        const refreshed = await tryRefreshAndSave();
        if (!refreshed) {
          //
        }

        headers.set("Authorization", `Bearer ${refreshed.accessToken}`);
        const retryResponse = await fetch(url, headers);

        if (retryResponse.ok) {
          setSuccessful(true);
        } else {
          setError(true);
        }

        await responseToJson(retryResponse);
      } else if (response.ok) {
        setSuccessful(true);
        await responseToJson(response);
      } else {
        setError(true);
        await responseToJson(response);
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Unknown error occurred");
      setError(true);
      throw error;
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
