import { APIResponseType } from "../../types/apiCallTypes";
import { withUpdatedKnownStudied } from "./responseUpdaters";
import { ValidPkFieldType } from "../../types/views/dictionary-items/sharedTypes";
import { APIDataChangeCacheUpdater } from "src/types/cacheTypes";

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
): APIDataChangeCacheUpdater<"knownChanged" | "studiedChanged">[] => {
  const knownStudiedUpdaters = (["known", "studied"] as const).map(
    (knownOrStudied) => {
      const eventTypeMapping = {
        known: "knownChanged",
        studied: "studiedChanged",
      } as const;

      return {
        pk: pk,
        eventType: eventTypeMapping[knownOrStudied],
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
