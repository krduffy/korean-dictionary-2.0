import { APIResponseType } from "src/types/apiCallTypes";
import { withUpdatedKnownStudied } from "./responseUpdaters";

export const getCacheUpdaters = ({
  pks,
  pathGetter,
}: {
  pks: (number | string)[];
  pathGetter: (pk: number | string) => (number | string)[];
}) => {
  return pks.flatMap((pk) => getKnownStudiedCacheUpdaters(pk, pathGetter(pk)));
};

const getKnownStudiedCacheUpdaters = (
  pk: number | string,
  path: (number | string)[]
) => {
  const knownStudiedUpdaters = (["known", "studied"] as const).map(
    (knownOrStudied) => {
      return {
        pk: pk,
        eventType: knownOrStudied,
        responseUpdater: (prevResponse: APIResponseType, newValue: boolean) => {
          return withUpdatedKnownStudied({
            fullResponse: prevResponse,
            pathToKnownStudied: path,
            knownOrStudied: knownOrStudied,
            newValue: newValue,
          });
        },
      };
    }
  );

  return knownStudiedUpdaters;
};
