import { APIResponseType } from "../../types/apiCallTypes";
import { withUpdatedKnownStudied } from "./responseUpdaters";
import { ValidPkFieldType } from "../../types/views/dictionary-items/sharedTypes";

export const getCacheUpdaters = <PkFieldType extends ValidPkFieldType>({
  pks,
  pathGetter,
}: {
  pks: PkFieldType[];
  pathGetter: (pk: PkFieldType) => (number | string)[];
}) => {
  return pks.flatMap((pk) => getKnownStudiedCacheUpdaters(pk, pathGetter(pk)));
};

const getKnownStudiedCacheUpdaters = <PkFieldType extends ValidPkFieldType>(
  pk: PkFieldType,
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
