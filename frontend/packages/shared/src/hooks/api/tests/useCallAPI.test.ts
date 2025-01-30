/**
 * @jest-environment jsdom
 */

import {
  jest,
  it,
  describe,
  beforeEach,
  afterEach,
  expect,
} from "@jest/globals";
import { renderHook, act } from "@testing-library/react";
import { useCallAPI } from "../useCallAPI";
import { TokenHandlers, UseCallAPIArgs } from "../../../types/apiCallTypes";
import { CacheItem, UseCacheReturns } from "../../../types/cacheTypes";
import { MockedFetchType, FetchMockFactory } from "./FetchMockFactory";

describe("useCallAPI", () => {
  const url = "";

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
    setItemListenerArgs: jest.fn(),
    keepOnlyUrlsWithOneOfSubstrings: jest.fn(),
  };

  const mockedOnCaughtError = jest.fn();

  /* Values from fetch mock factory are used for expect calls */
  const fetchMockFactory = new FetchMockFactory();

  const mockFetch = (mockedImplementation: MockedFetchType) => {
    /* The type of this mock is not at all the type of fetch, so the errors are just
       silenced. very few fields are used in fetch for this project and pretty much every
       api call is made through useCallAPI */

    // @ts-ignore
    // eslint-disable-next-line
    global.fetch = jest
      .fn<MockedFetchType>()
      .mockImplementation(mockedImplementation);
  };

  const callRenderHook = ({
    tokenHandlers = mockedTokenHandlers,
    cacheResults = false,
    cacheFunctions = mockedCacheFunctions,
    onCaughtError = mockedOnCaughtError,
  }: Partial<UseCallAPIArgs>) => {
    return renderHook(() =>
      useCallAPI({
        tokenHandlers,
        cacheResults,
        cacheFunctions,
        onCaughtError,
      })
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
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

    const fetchMock = new FetchMockFactory().setAuthOnlyChecked().getMock();
    mockFetch(fetchMock);

    const { result } = callRenderHook({});

    await act(async () => {
      await result.current.callAPI(url);
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    /* headers are empty since no config was passed into the callAPI func and access token
       is null */
    expect(fetch).toHaveBeenCalledWith(url, expect.objectContaining({}));
    expect(mockedTokenHandlers.getAccessToken).toHaveBeenCalledTimes(1);
    expect(mockedTokenHandlers.refreshTokens).toHaveBeenCalledTimes(1);
    expect(mockedTokenHandlers.onRefreshFail).toHaveBeenCalledTimes(1);
    expect(mockedTokenHandlers.saveTokens).not.toHaveBeenCalled();
    expect(mockedTokenHandlers.deleteTokens).not.toHaveBeenCalled();

    /* still successful because */
    expect(result.current.requestState.progress).toBe("success");
    expect(result.current.requestState.response).toEqual(
      fetchMockFactory.unauthenticatedSuccessResponse
    );
  });

  /**
   * Same as test above but the access token is not initially null.
   */
  it("does properly: access not null / refresh not required / auth not required", async () => {
    const returnedToken = /* (not valid) */ "token";

    mockedTokenHandlers.getAccessToken.mockResolvedValue(returnedToken);

    /* unauthenticated/authenticated are both successes */
    const fetchMock = new FetchMockFactory().setAuthOnlyChecked().getMock();
    mockFetch(fetchMock);

    const { result } = callRenderHook({});

    await act(async () => {
      await result.current.callAPI(url);
    });

    const expectedConfigOnCall = { headers: new Headers() };
    /* "token" is value from above. */
    expectedConfigOnCall.headers.set(
      "Authorization",
      `Bearer ${returnedToken}`
    );

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({ ...expectedConfigOnCall })
    );
    expect(mockedTokenHandlers.getAccessToken).toHaveBeenCalledTimes(1);

    /* because response.status was not 401 there should be no refresh attempt */
    expect(mockedTokenHandlers.refreshTokens).not.toHaveBeenCalled();
    expect(mockedTokenHandlers.onRefreshFail).not.toHaveBeenCalled();
    expect(mockedTokenHandlers.saveTokens).not.toHaveBeenCalled();
    expect(mockedTokenHandlers.deleteTokens).not.toHaveBeenCalled();

    /* still successful because api endpoint does not require auth */
    expect(result.current.requestState.progress).toBe("success");
    expect(result.current.requestState.response).toEqual(
      fetchMockFactory.unauthenticatedSuccessResponse
    );
  });

  /**
   * Same as the test above but the access token is invalid and causes a 401 response
   * from the server, prompting a successful refresh.
   */
  it("does properly: access not null / refresh required / refresh successful / auth required", async () => {
    /* will be considered invalid */

    const invalidToken = "invalidtoken";

    const refreshResponse = {
      access: fetchMockFactory.authenticatedToken,
    };

    mockedTokenHandlers.getAccessToken.mockResolvedValue(invalidToken);
    mockedTokenHandlers.refreshTokens.mockResolvedValue(refreshResponse);

    const fetchMock = new FetchMockFactory().setAuthProtected().getMock();
    mockFetch(fetchMock);

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
    expectedConfigOnCall2.headers.set(
      "Authorization",
      `Bearer ${fetchMockFactory.authenticatedToken}`
    );

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenNthCalledWith(1, url, expectedConfigOnCall1);
    expect(fetch).toHaveBeenNthCalledWith(2, url, expectedConfigOnCall2);

    expect(mockedTokenHandlers.getAccessToken).toHaveBeenCalledTimes(1);
    expect(mockedTokenHandlers.refreshTokens).toHaveBeenCalledTimes(1);

    expect(mockedTokenHandlers.onRefreshFail).not.toHaveBeenCalled();
    expect(mockedTokenHandlers.saveTokens).toHaveBeenCalledTimes(1);
    /* expect this to be called once because the initial token that was 
       returned from the getAccessToken function resulted in 401 */
    expect(mockedTokenHandlers.deleteTokens).toHaveBeenCalledTimes(1);

    expect(result.current.requestState.progress).toBe("success");
    expect(result.current.requestState.response).toEqual(
      fetchMockFactory.authenticatedSuccessResponse
    );
  });

  it("puts and receives from the cache properly", async () => {
    const response = { data: "data" };

    const fetchMock = new FetchMockFactory().setGetJson(response).getMock();
    mockFetch(fetchMock);

    const { result } = callRenderHook({ cacheResults: true });

    const cachedItem: CacheItem = {
      lastAccessed: 0,
      ok: true,
      response: response,
      apiDataChangeSubscriptionArgs: [],
    };

    /* at first not in cache; when put is called the mock is updated. */
    mockedCacheFunctions.retrieve.mockImplementation(() => null);
    /* pretending that the caching was done to the mock */
    mockedCacheFunctions.put.mockImplementation(() => {
      // eslint-disable-next-line no-unused-vars
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
    expect(result.current.requestState.progress).toBe("success");
    expect(result.current.requestState.response).toEqual(response);

    /* After the first time the fetch mock needs to be updated */

    /* doing a second time; after first time things should have been cached */
    await act(async () => {
      await result.current.callAPI(url);
    });

    /* still 1 ! */
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(mockedCacheFunctions.retrieve).toHaveLastReturnedWith(cachedItem);
    expect(result.current.requestState.progress).toBe("success");
    expect(result.current.requestState.response).toEqual(response);
  });

  it("catches unknown errors", async () => {
    const fetchMock = new FetchMockFactory().setToError().getMock();
    mockFetch(fetchMock);

    const { result } = callRenderHook({});

    const doAction = async () => {
      await act(async () => {
        await result.current.callAPI(url);
      });
    };

    await expect(doAction()).rejects.toThrow(fetchMockFactory.errorMessage);
    expect(mockedOnCaughtError).toHaveBeenCalled();
  });
});
