import { useEffect } from "react";
import { useCachingContext } from "../../contexts/CachingContextProvider";
import {
  APIResponseType,
  isPaginatedResultsResponse,
} from "../../types/apiCallTypes";
import {
  isDetailedKoreanType,
  isKoreanSearchResultType,
  KoreanSearchResultType,
} from "../../types/views/dictionary-items/koreanDictionaryItems";
import {
  SubscribeFnType,
  UnsubscribeFnType,
} from "../../types/apiDataChangeEventTypes";
import { getCacheUpdaters } from "../cache/cacheUpdaters";
import { usePanelFunctionsContext } from "../../contexts/PanelFunctionsContextProvider";
import {
  HanjaSearchResultType,
  isDetailedHanjaType,
  isHanjaExampleKoreanWordType,
  isHanjaSearchResultType,
  KoreanWordInHanjaExamplesType,
} from "../../types/views/dictionary-items/hanjaDictionaryItems";
import {
  getPkField,
  SearchResultType,
  ValidPkFieldType,
} from "../../types/views/dictionary-items/sharedTypes";

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

const useDictionaryItemListenerManager = <
  PkFieldType extends ValidPkFieldType,
>({
  url,
  pks,
  pathGetter,
  refetch,
}: {
  url: string;
  pks: PkFieldType[];
  // eslint-disable-next-line no-unused-vars
  pathGetter: (pk: PkFieldType) => (number | string)[];
  refetch: () => void;
}) => {
  const { setItemListenerArgs } = useCachingContext();
  const { panelSubscribeSelf, panelUnsubscribeSelf } =
    usePanelFunctionsContext();

  /* Setting the listeners in the cache to update the cached value on data change */
  useEffect(() => {
    /* (body is not used for any of the requests that use this hook) */
    setItemListenerArgs({
      url,
      cacheUpdaters: getCacheUpdaters<PkFieldType>({
        pks: pks,
        pathGetter: pathGetter,
      }),
    });
  }, [pks]);

  /* Setting the listener for the view to reload when the value changes. The event for 
     updating the cache fires first, so this will get the new value from the cache
     or refretch from api if the cached value was evicted */
  useEffect(() => {
    const subscribeArguments = getPkLoadedDataChangedSubscriptionArgs(
      pks,
      refetch
    );
    subscribeAll(panelSubscribeSelf, subscribeArguments);

    return () => unsubscribeAll(panelUnsubscribeSelf, subscribeArguments);
  }, [pks]);
};

export const useSearchResultListListenerManager = <
  ResultType extends SearchResultType,
>({
  url,
  response,
  refetch,
  typeVerifier,
}: {
  url: string;
  response: APIResponseType;
  refetch: () => void;
  typeVerifier: (data: unknown) => data is ResultType;
}) => {
  /* If any of the guards before this fail and the list is [] then nothing is done
     by any of the use effects */
  const responseList =
    isPaginatedResultsResponse(response, typeVerifier) &&
    Array.isArray(response.results) &&
    response.results.every((data) => typeVerifier(data))
      ? (response.results as ResultType[])
      : [];

  const pks = responseList.map((searchResult) => getPkField(searchResult));

  const pathGetter = (pk: number | string) => {
    /* returning [] will cause the update cache result function to do nothing */
    if (
      !Array.isArray(responseList) ||
      !responseList.every((data) => typeVerifier(data))
    ) {
      return [];
    }

    const index = responseList.findIndex((result) => getPkField(result) === pk);

    if (index === -1) return [];

    return ["results", index, "user_data"];
  };

  return useDictionaryItemListenerManager({
    url,
    pks,
    pathGetter,
    refetch,
  });
};

/***************************/

export const useKoreanSearchResultListenerManager = ({
  url,
  response,
  refetch,
}: {
  url: string;
  response: APIResponseType;
  refetch: () => void;
}) => {
  return useSearchResultListListenerManager<KoreanSearchResultType>({
    url,
    response: response,
    refetch: refetch,
    typeVerifier: isKoreanSearchResultType,
  });
};

export const useKoreanDetailListenerManager = ({
  url,
  response,
  refetch,
}: {
  url: string;
  response: APIResponseType;
  refetch: () => void;
}) => {
  const pks = isDetailedKoreanType(response) ? [response.target_code] : [];

  return useDictionaryItemListenerManager({
    url,
    pks,
    pathGetter: () => ["user_data"],
    refetch,
  });
};

export const useHanjaSearchResultListenerManager = ({
  url,
  response,
  refetch,
}: {
  url: string;
  response: APIResponseType;
  refetch: () => void;
}) => {
  return useSearchResultListListenerManager<HanjaSearchResultType>({
    url,
    response,
    refetch,
    typeVerifier: isHanjaSearchResultType,
  });
};

export const useHanjaDetailListenerManager = ({
  url,
  response,
  refetch,
}: {
  url: string;
  response: APIResponseType;
  refetch: () => void;
}) => {
  const pks = isDetailedHanjaType(response) ? [response.character] : [];

  return useDictionaryItemListenerManager({
    url,
    pks,
    pathGetter: () => ["user_data"],
    refetch,
  });
};

export const useHanjaExampleKoreanWordListenerManager = ({
  url,
  response,
  refetch,
}: {
  url: string;
  response: APIResponseType;
  refetch: () => void;
}) => {
  return useSearchResultListListenerManager<KoreanWordInHanjaExamplesType>({
    url,
    response,
    refetch,
    typeVerifier: isHanjaExampleKoreanWordType,
  });
};
