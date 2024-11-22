import { useState } from "react";
import {
  UseCallAPIArgs,
  UseCallAPIReturns,
  RequestConfig,
} from "../types/apiCallTypes";
import { APIResponseType } from "../types/apiCallTypes";

export const useCallAPI = ({
  tokenHandlers,
  cacheResults,
  cacheFunctions,
  onCaughtError,
}: UseCallAPIArgs): UseCallAPIReturns => {
  const { put, retrieve } = cacheFunctions;

  /* Whether the most recent api call was successful (response.ok) or not. */
  const [successful, setSuccessful] = useState(false);
  /* Whether the most recent api call was unsuccessful (!response.ok) or not. */
  const [error, setError] = useState(false);
  /* Whether an api call is in progress. */
  const [loading, setLoading] = useState(false);
  /* The most recent response, stored as a json object. */
  const [response, setResponse] = useState<APIResponseType | null>(null);

  /**
   * Attempts to refresh the access token in storage.
   * If refreshing is successful, the tokens are saved.
   * If refreshing is unsuccessful, `tokenHandlers.onRefreshFail()` is called.
   *
   * @returns The refreshed access token if refreshing was successful; null otherwise.
   */
  const tryRefreshAndSave = async (): Promise<string | null> => {
    const refreshed = await tokenHandlers.refreshTokens();
    if (refreshed?.access) {
      await tokenHandlers.saveTokens(refreshed);
      return refreshed.access;
    } else {
      await tokenHandlers.onRefreshFail();
      return null;
    }
  };

  /**
   * Called when `callAPI` exits early with one of its response attempts.
   *
   * @param response - The response to consider final.
   * @param url - The url callAPI was called with. Needed for potential caching.
   * @param configBody - The config.body callAPI was called with. Needed for potential caching.
   * @returns The jsonified response (`response.json()`)
   */
  const exitWithResponse = async (
    response: Response,
    url: string,
    configBody: BodyInit | undefined
  ): Promise<APIResponseType> => {
    const wasSuccessful = response.ok;
    setSuccessful(wasSuccessful);
    setError(!wasSuccessful);

    const jsonified = await response.json();
    setResponse(jsonified);

    /* Setting cache here */
    if (cacheResults) {
      put(url, jsonified, wasSuccessful, configBody);
    }

    return new Promise((resolve) => resolve(jsonified));
  };

  /**
   * Calls the api at a specific endpoint.
   *
   * @param url - The url endpoint.
   * @param config - The base configuration to pass to `fetch`.
   * @returns A promise that resolves to the response returned.
   */
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

    /**
     * Not in cache; need to actually fetch
     *
     * Flow for a real fetch from the api
     * 1. Check for token
     *     => if not null: go to step 2
     *     => else: go to step 3
     * 2. do fetch
     *     (** 401 error is checked for since an expired jwt leads to status 401 **)
     *     => if 401 error: go to step 3
     *     => else: done (set states and exit)
     * 3. attempt refresh
     *     => if not null: go to step 4
     *     => else: call on refresh fail (require login), then done (set states and exit)
     * 4. do fetch
     *     (** Do not check for 401 **)
     *     => done (set states and exit)
     */

    try {
      /* Step 1: Check for token */
      const accessToken = await tokenHandlers.getAccessToken();

      /* Step 2: if access token not null, try fetch */
      if (accessToken !== null) {
        const headers = new Headers(config.headers);
        headers.set("Authorization", `Bearer ${accessToken}`);

        const response = await fetch(url, {
          ...config,
          headers,
        });

        if (response.status !== 401) {
          return exitWithResponse(response, url, config.body);
        } else {
          /* If 401 then delete the expired token that led to that; will require
             the user's reauthentication after */
          await tokenHandlers.deleteTokens();
        }
      }

      /* Step 3: If access token is null, attempt refresh. This also runs if 
                 access token was not null but response.status above was 401 */
      const refreshedAccess = await tryRefreshAndSave();

      /* It may be true that the api endpoint does not require authentication,
         so there is an attempt without sending the Bearer header */
      if (refreshedAccess === null) {
        const headers = new Headers(config.headers);
        const response = await fetch(url, { ...config, headers });

        return exitWithResponse(response, url, config.body);
      }

      /* Refresh was successful */
      const headers = new Headers(config.headers);
      headers.set("Authorization", `Bearer ${refreshedAccess}`);

      const response = await fetch(url, {
        ...config,
        headers,
      });

      return exitWithResponse(response, url, config.body);
    } catch (err) {
      setError(true);
      onCaughtError(err);
      return Promise.reject(err);
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
