import { useEffect, useRef } from "react";
import { useAPIDataChangeManagerContext } from "../../contexts/APIDataChangeManagerContextProvider";
import { useCachingContext } from "../../contexts/CachingContextProvider";
import { APIResponseType } from "../../types/apiCallTypes";
import {
  isKoreanSearchResultType,
  KoreanSearchResultType,
} from "../../types/views/dictionary-items/koreanDictionaryItems";
import { APIDataChangeListenerData } from "src/types/apiDataChangeEventTypes";
import { getKoreanSearchCacheUpdaters } from "../cache/cacheUpdaters";

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
  searchResults,
}: {
  url: string;
  searchResults: APIResponseType;
}) => {
  const { setItemListenerArgs } = useCachingContext();

  useEffect(() => {
    if (
      !Array.isArray(searchResults?.results) ||
      !searchResults?.results?.every((data) => isKoreanSearchResultType(data))
    ) {
      return;
    }
    console.log(typeof setItemListenerArgs);
    setItemListenerArgs({
      url,
      cacheUpdaters: getKoreanSearchCacheUpdaters({
        pks: pks,
        pathGetter: getPathGetterFunc(searchResults.results),
      }),
    });
  }, [searchResults]);

  const pks =
    Array.isArray(searchResults?.results) &&
    searchResults?.results?.every((data) => isKoreanSearchResultType(data))
      ? searchResults.results.map((searchResult) => searchResult.target_code)
      : [];

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
