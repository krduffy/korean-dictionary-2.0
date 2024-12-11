import { useEffect, useRef } from "react";
import { useAPIDataChangeManagerContext } from "../../contexts/APIDataChangeManagerContextProvider";
import { useCachingContext } from "../../contexts/CachingContextProvider";
import { APIResponseType } from "../../types/apiCallTypes";
import {
  isKoreanSearchResultType,
  KoreanSearchResultType,
} from "../../types/views/dictionary-items/koreanDictionaryItems";
import { withUpdatedKnownStudied } from "../cache/cacheUpdaters";
import { APIDataChangeListenerData } from "src/types/apiDataChangeEventTypes";

const useListenerManager = ({
  url,
  body,
  listenerData,
}: {
  url: string;
  body?: BodyInit | undefined;
  listenerData: {
    pk: number;
    listenerDataObjects: APIDataChangeListenerData[];
  }[];
}) => {
  const { subscribe, unsubscribe } = useAPIDataChangeManagerContext();

  useEffect(() => {
    listenerData.forEach((pkData) => {
      pkData.listenerDataObjects.forEach((listenerData) => {
        subscribe(pkData.pk, listenerData);
      });
    });

    return () => {
      listenerData.forEach((pkData) => {
        pkData.listenerDataObjects.forEach((listenerData) => {
          unsubscribe(pkData.pk, listenerData);
        });
      });
    };
  }, [listenerData]);
};

export const useKoreanSearchResultListenerManager = ({
  url,
  response,
}: {
  url: string;
  response: APIResponseType;
}) => {
  const getKoreanKnownStudiedSubscriptionData = (
    pks: number[],
    pathGetter: (pk: number) => (string | number)[]
  ) => {
    return pks.map((pk) => {
      return {
        pk,
        listenerDataObjects: (["known", "studied"] as const).map(
          (knownOrStudied) => {
            return {
              eventType: knownOrStudied,
              onNotification: (newValue: boolean) => {
                console.log("!!!! " + knownOrStudied);
              },
            };
          }
        ),
      };
    });
  };

  const getAllListenerData = () => {
    if (
      !Array.isArray(response?.results) ||
      !response?.results?.every((data) => isKoreanSearchResultType(data))
    ) {
      return [];
    }

    const pks = response.results.map(
      (searchResult) => searchResult.target_code
    );

    const getPathGetterFunc = (results: KoreanSearchResultType[]) => {
      return (pk: number) => {
        const index = results.findIndex((result) => result.target_code === pk);

        if (index === -1)
          throw new Error(
            `pk supplied to path getter not in response array. pk: ${pk} result pks: ${results.map((result) => result.target_code)}`
          );

        return ["results", pk, "user_data"];
      };
    };

    return getKoreanKnownStudiedSubscriptionData(
      pks,
      getPathGetterFunc(response.results)
    );
  };

  return useListenerManager({
    url: url,
    listenerData: getAllListenerData(),
  });
};
