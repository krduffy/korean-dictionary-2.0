import { APIResponseType } from "../../types/apiCallTypes";
import {
  isDetailedKoreanType,
  isKoreanHeadwordInExampleType,
  isKoreanSearchResultType,
  KoreanHeadwordInExampleType,
  KoreanSearchResultType,
} from "../../types/views/dictionary-items/koreanDictionaryItems";
import {
  HanjaSearchResultType,
  isDetailedHanjaType,
  isHanjaSearchResultType,
} from "../../types/views/dictionary-items/hanjaDictionaryItems";

import { useSearchResultListListenerHandler } from "./useSearchResultListListenerHandler";
import { useDictionaryItemListenerHandler } from "./useDictionaryItemListenerHandler";
import { useGeneralPanelReloadListenerHandler } from "./useGeneralPanelReloadListenerHandler";

export const useKoreanSearchResultListenerHandler = ({
  url,
  response,
  refetch,
}: {
  url: string;
  response: APIResponseType;
  refetch: () => void;
}) => {
  useGeneralPanelReloadListenerHandler({ refetch });
  useSearchResultListListenerHandler<KoreanSearchResultType>({
    url,
    response: response,
    refetch: refetch,
    typeVerifier: isKoreanSearchResultType,
  });
};

export const useKoreanDetailListenerHandler = ({
  url,
  response,
  refetch,
}: {
  url: string;
  response: APIResponseType;
  refetch: () => void;
}) => {
  const pks = isDetailedKoreanType(response) ? [response.target_code] : [];

  useGeneralPanelReloadListenerHandler({ refetch });
  useDictionaryItemListenerHandler({
    url,
    pks,
    pathGetter: () => ["user_data"],
    refetch,
  });
};

export const useHanjaSearchResultListenerHandler = ({
  url,
  response,
  refetch,
}: {
  url: string;
  response: APIResponseType;
  refetch: () => void;
}) => {
  useGeneralPanelReloadListenerHandler({ refetch });
  useSearchResultListListenerHandler<HanjaSearchResultType>({
    url,
    response,
    refetch,
    typeVerifier: isHanjaSearchResultType,
  });
};

export const useHanjaDetailListenerHandler = ({
  url,
  response,
  refetch,
}: {
  url: string;
  response: APIResponseType;
  refetch: () => void;
}) => {
  const pks = isDetailedHanjaType(response) ? [response.character] : [];

  useGeneralPanelReloadListenerHandler({ refetch });
  useDictionaryItemListenerHandler({
    url,
    pks,
    pathGetter: () => ["user_data"],
    refetch,
  });
};

export const useHanjaExampleKoreanHeadwordListenerHandler = ({
  url,
  response,
  refetch,
}: {
  url: string;
  response: APIResponseType;
  refetch: () => void;
}) => {
  useGeneralPanelReloadListenerHandler({ refetch });
  useSearchResultListListenerHandler<KoreanHeadwordInExampleType>({
    url,
    response,
    refetch,
    typeVerifier: isKoreanHeadwordInExampleType,
  });
};
