import { useEffect } from "react";
import { useCachingContext } from "../../contexts/CachingContextProvider";
import { CallbackParamMappings } from "../../types/apiDataChangeEventTypes";
import { getCacheUpdaters } from "../cache/cacheUpdaters";
import { usePanelFunctionsContext } from "../../contexts/PanelFunctionsContextProvider";
import { ValidPkFieldType } from "../../types/views/dictionary-items/sharedTypes";
import { APIDataChangeCacheUpdater } from "../../types/cacheTypes";
import {
  SubscribeFnType,
  UnsubscribeFnType,
} from "../../types/apiDataChangeEventTypes";

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

export const useDictionaryItemListenerHandler = <
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
      }) as APIDataChangeCacheUpdater<keyof CallbackParamMappings>[],
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
