import { APIResponseType } from "src/types/apiCallTypes";
import { withUpdatedKnownStudied } from "./responseUpdaters";

export const getKoreanSearchCacheUpdaters = ({
  pks,
  pathGetter,
}: {
  pks: number[];
  pathGetter: (pk: number) => (number | string)[];
}) => {
  return pks.flatMap((pk) =>
    getKoreanSearchCacheUpdatersForPk(pk, pathGetter(pk))
  );
};

const getKoreanSearchCacheUpdatersForPk = (
  pk: number,
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
