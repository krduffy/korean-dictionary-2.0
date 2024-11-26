/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react";
import { useCallAPI } from "../useCallAPI";
import { TokenHandlers } from "src/types/apiCallTypes";
import { CacheItem, UseCacheReturns } from "src/types/cacheTypes";

/* Mocking all of the functions that are called internally to verify num of times they are called. */
const mockedTokenHandlers: jest.Mocked<TokenHandlers> = {
  getAccessToken: jest.fn(),
  refreshTokens: jest.fn(),
  onRefreshFail: jest.fn(),
  deleteTokens: jest.fn(),
  saveTokens: jest.fn(),
};

const mockedCacheFunctions: jest.Mocked<UseCacheReturns> = {
  put: jest.fn(),
  retrieve: jest.fn(),
  clear: jest.fn(),
};

const mockedOnCaughtError = jest.fn();

describe("useCallAPI", () => {
  const url = "";

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  /**
   * In this case, refresh fails but the mocked apiCall returns a different response for authenticated
   * and unauthenticated users. Since refresh should fail, the response for unauthenticated users
   * should be returned.
   */
  it("does properly: access null / refresh fails / auth not required", async () => {
    mockedTokenHandlers.getAccessToken.mockResolvedValue(null);
    mockedTokenHandlers.refreshTokens.mockResolvedValue(null);

    const authResponse = { message: "Authenticated; success" };
    const notAuthResponse = { message: "Unauthenticated; success" };

    global.fetch = jest.fn().mockImplementation((url, requestInit) => {
      return {
        ok: true,
        status: 200,
        json: () => {
          const hasAuthHeader = requestInit.headers.get("Authorization");
          return hasAuthHeader ? authResponse : notAuthResponse;
        },
      };
    });

    const { result } = renderHook(() =>
      useCallAPI({
        tokenHandlers: mockedTokenHandlers,
        cacheResults: false,
        cacheFunctions: mockedCacheFunctions,
        onCaughtError: mockedOnCaughtError,
      })
    );

    await act(async () => {
      await result.current.callAPI(url);
    });

    /* headers are empty since no config was passed into the callAPI func and access token
       is null */
    const expectedConfigOnCall = { headers: new Headers() };

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, expectedConfigOnCall);
    expect(mockedTokenHandlers.getAccessToken).toHaveBeenCalledTimes(1);
    expect(mockedTokenHandlers.refreshTokens).toHaveBeenCalledTimes(1);
    expect(mockedTokenHandlers.onRefreshFail).toHaveBeenCalledTimes(1);
    expect(mockedTokenHandlers.saveTokens).not.toHaveBeenCalled();
    expect(mockedTokenHandlers.deleteTokens).not.toHaveBeenCalled();

    /* still successful because */
    expect(result.current.successful).toBe(true);
    expect(result.current.error).toBe(false);
    expect(result.current.response).toEqual(notAuthResponse);
  });

  /**
   * Same as test above but the access token is not initially null.
   */
  it("does properly: access not null / refresh not required / auth not required", async () => {
    mockedTokenHandlers.getAccessToken.mockResolvedValue("token");

    /* both are successes */
    const authResponse = { message: "Authenticated; success" };
    const notAuthResponse = { message: "Unauthenticated; success" };

    global.fetch = jest.fn().mockImplementation((url, requestInit) => {
      return {
        ok: true,
        status: 200,
        json: () => {
          const hasAuthHeader = requestInit.headers.get("Authorization");
          return hasAuthHeader ? authResponse : notAuthResponse;
        },
      };
    });

    const { result } = renderHook(() =>
      useCallAPI({
        tokenHandlers: mockedTokenHandlers,
        cacheResults: false,
        cacheFunctions: mockedCacheFunctions,
        onCaughtError: mockedOnCaughtError,
      })
    );

    await act(async () => {
      await result.current.callAPI(url);
    });

    /* headers are empty since no config was passed into the callAPI func and access token
       is null */
    const expectedConfigOnCall = { headers: new Headers() };
    /* "token" is value from above. */
    expectedConfigOnCall.headers.set("Authorization", "Bearer token");

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, expectedConfigOnCall);
    expect(mockedTokenHandlers.getAccessToken).toHaveBeenCalledTimes(1);

    /* because response.status was not 401 there should be no refresh attempt */
    expect(mockedTokenHandlers.refreshTokens).not.toHaveBeenCalled();
    expect(mockedTokenHandlers.onRefreshFail).not.toHaveBeenCalled();
    expect(mockedTokenHandlers.saveTokens).not.toHaveBeenCalled();
    expect(mockedTokenHandlers.deleteTokens).not.toHaveBeenCalled();

    /* still successful because api endpoint does not require auth */
    expect(result.current.successful).toBe(true);
    expect(result.current.error).toBe(false);
    expect(result.current.response).toEqual(authResponse);
  });

  /**
   * Same as the test above but the access token is invalid and causes a 401 response
   * from the server, prompting a successful refresh.
   */
  it("does properly: access not null / refresh required / refresh successful / auth required", async () => {
    /* will be considered invalid */

    const validToken = "validtoken";
    const invalidToken = "invalidtoken";

    mockedTokenHandlers.getAccessToken.mockResolvedValue(invalidToken);
    mockedTokenHandlers.refreshTokens.mockResolvedValue({
      access: validToken,
    });

    const authResponse = { message: "Authenticated; success" };
    const notAuthResponse = { message: "Unauthenticated; error" };

    global.fetch = jest.fn().mockImplementation((url, requestInit) => {
      const token = requestInit.headers.get("Authorization");

      if (token === `Bearer ${validToken}`) {
        return {
          ok: true,
          status: 200,
          json: () => authResponse,
        };
      } else {
        return {
          ok: false,
          status: 401,
          json: () => notAuthResponse,
        };
      }
    });

    const { result } = renderHook(() =>
      useCallAPI({
        tokenHandlers: mockedTokenHandlers,
        cacheResults: false,
        cacheFunctions: mockedCacheFunctions,
        onCaughtError: mockedOnCaughtError,
      })
    );

    await act(async () => {
      await result.current.callAPI(url);
    });

    /* first time has invalid token, second has valid one after the refresh */
    const expectedConfigOnCall1 = { headers: new Headers() };
    expectedConfigOnCall1.headers.set(
      "Authorization",
      `Bearer ${invalidToken}`
    );
    const expectedConfigOnCall2 = { headers: new Headers() };
    expectedConfigOnCall2.headers.set("Authorization", `Bearer ${validToken}`);

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenNthCalledWith(1, url, expectedConfigOnCall1);
    expect(fetch).toHaveBeenNthCalledWith(2, url, expectedConfigOnCall2);

    expect(mockedTokenHandlers.getAccessToken).toHaveBeenCalledTimes(1);
    expect(mockedTokenHandlers.refreshTokens).toHaveBeenCalledTimes(1);
    expect(mockedTokenHandlers.onRefreshFail).not.toHaveBeenCalled();
    expect(mockedTokenHandlers.saveTokens).toHaveBeenCalledTimes(1);
    expect(mockedTokenHandlers.deleteTokens).not.toHaveBeenCalled();

    /* still successful because */
    expect(result.current.successful).toBe(true);
    expect(result.current.error).toBe(false);
    expect(result.current.response).toEqual(authResponse);
  });

  it("puts and receives from the cache properly", async () => {
    const response = { message: "Success" };

    global.fetch = jest.fn().mockImplementation((url, requestInit) => {
      return {
        ok: true,
        status: 200,
        json: () => response,
      };
    });

    const { result } = renderHook(() =>
      useCallAPI({
        tokenHandlers: mockedTokenHandlers,
        cacheResults: true,
        cacheFunctions: mockedCacheFunctions,
        onCaughtError: mockedOnCaughtError,
      })
    );

    const cachedItem: CacheItem = {
      lastAccessed: 0,
      ok: true,
      response: response,
    };

    /* at first not in cache; when put is called the mock is updated. */
    mockedCacheFunctions.retrieve.mockImplementation(() => null);
    /* pretending that the caching was done to the mock */
    mockedCacheFunctions.put.mockImplementation(() => {
      mockedCacheFunctions.retrieve.mockImplementation((calledUrl, body) => {
        if (calledUrl === url) {
          return cachedItem;
        }
        return null;
      });
    });

    await act(async () => {
      await result.current.callAPI(url);
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(mockedCacheFunctions.put).toHaveBeenCalled();
    expect(mockedCacheFunctions.retrieve).toHaveLastReturnedWith(null);
    expect(result.current.successful).toBe(true);
    expect(result.current.error).toBe(false);
    expect(result.current.response).toEqual(response);

    /* doing a second time; after first time things should have been cached */
    await act(async () => {
      await result.current.callAPI(url);
    });

    /* still 1 ! */
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(mockedCacheFunctions.retrieve).toHaveLastReturnedWith(cachedItem);
    expect(result.current.successful).toBe(true);
    expect(result.current.error).toBe(false);
    expect(result.current.response).toEqual(response);
  });

  it("catches unknown errors", async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      throw new Error("Error");
    });

    const { result } = renderHook(() =>
      useCallAPI({
        tokenHandlers: mockedTokenHandlers,
        cacheResults: false,
        cacheFunctions: mockedCacheFunctions,
        onCaughtError: mockedOnCaughtError,
      })
    );

    const doAction = async () => {
      await act(async () => {
        await result.current.callAPI(url);
      });
    };

    await expect(doAction()).rejects.toThrow("Error");
    expect(mockedOnCaughtError).toHaveBeenCalled();
  });
});
