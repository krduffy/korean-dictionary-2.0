import { useEffect } from "react";
import { useCachingContext } from "../../contexts/CachingContextProvider";
import { APIResponseType } from "../../types/apiCallTypes";
import {
  isDetailedKoreanType,
  isKoreanSearchResultType,
  KoreanSearchResultType,
} from "../../types/views/dictionary-items/koreanDictionaryItems";
import {
  SubscribeFnType,
  UnsubscribeFnType,
} from "../../types/apiDataChangeEventTypes";
import { getKoreanSearchCacheUpdaters } from "../cache/cacheUpdaters";
import { usePanelFunctionsContext } from "../../contexts/PanelFunctionsContextProvider";

const getPkLoadedDataChangedSubscriptionArgs = (
  pks: (number | string)[],
  refetch: () => void
): Parameters<SubscribeFnType>[] => {
  return pks.map((pk) => {
    return [
      pk,
      {
        eventType: "loadedDataChanged",
        onNotification: () => refetch(),
      },
    ];
  });
};

const subscribeAll = (
  subscribe: SubscribeFnType,
  subscriptionArgs: Parameters<SubscribeFnType>[]
) => {
  subscriptionArgs.forEach((subscriptionArgsItem) => {
    console.log("subbing");
    subscribe(subscriptionArgsItem[0], subscriptionArgsItem[1]);
  });
};

const unsubscribeAll = (
  unsubscribe: UnsubscribeFnType,
  subscriptionArgs: Parameters<SubscribeFnType>[]
) => {
  subscriptionArgs.forEach((subscriptionArgsItem) => {
    unsubscribe(subscriptionArgsItem[0], subscriptionArgsItem[1]);
  });
};

export const useKoreanSearchResultListenerManager = ({
  url,
  searchResults,
  refetchSearchResults,
}: {
  url: string;
  searchResults: APIResponseType;
  refetchSearchResults: () => void;
}) => {
  const { setItemListenerArgs } = useCachingContext();
  const { dispatch, subscribe, unsubscribe } = usePanelFunctionsContext();

  useEffect(() => {
    if (
      !Array.isArray(searchResults?.results) ||
      !searchResults?.results?.every((data) => isKoreanSearchResultType(data))
    ) {
      return;
    }
    setItemListenerArgs({
      url,
      cacheUpdaters: getKoreanSearchCacheUpdaters({
        pks: pks,
        pathGetter: getPathGetterFunc(searchResults.results),
      }),
      subscribe,
    });
  }, [searchResults]);

  const pks =
    Array.isArray(searchResults?.results) &&
    searchResults?.results?.every((data) => isKoreanSearchResultType(data))
      ? searchResults.results.map((searchResult) => searchResult.target_code)
      : [];

  useEffect(() => {
    const subscribeArguments = getPkLoadedDataChangedSubscriptionArgs(
      pks,
      refetchSearchResults
    );
    subscribeAll(subscribe, subscribeArguments);

    return () => unsubscribeAll(unsubscribe, subscribeArguments);
  }, [pks]);

  const getPathGetterFunc = (results: KoreanSearchResultType[]) => {
    return (pk: number) => {
      const index = results.findIndex((result) => result.target_code === pk);

      if (index === -1)
        throw new Error(
          `pk supplied to path getter not in searchResults array. pk: ${pk} result pks: ${results.map((result) => result.target_code)}`
        );

      return ["results", index, "user_data"];
    };
  };
};

export const useKoreanDetailListenerManager = ({
  url,
  response,
}: {
  url: string;
  response: APIResponseType;
}) => {
  const { setItemListenerArgs } = useCachingContext();
  const { subscribe } = usePanelFunctionsContext();

  useEffect(() => {
    if (!isDetailedKoreanType(response)) {
      return;
    }

    setItemListenerArgs({
      url,
      cacheUpdaters: getKoreanSearchCacheUpdaters({
        pks: [response.target_code],
        pathGetter: () => ["user_data"],
      }),
      subscribe,
    });
  }, [response]);
};
