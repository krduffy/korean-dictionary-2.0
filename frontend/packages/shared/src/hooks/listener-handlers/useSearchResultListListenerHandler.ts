import {
  APIResponseType,
  isPaginatedResultsResponse,
} from "../../types/apiCallTypes";
import {
  getPkField,
  SearchResultType,
} from "../../types/views/dictionary-items/sharedTypes";
import { useDictionaryItemListenerHandler } from "./useDictionaryItemListenerHandler";

export const useSearchResultListListenerHandler = <
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

  return useDictionaryItemListenerHandler({
    url,
    pks,
    pathGetter,
    refetch,
  });
};
