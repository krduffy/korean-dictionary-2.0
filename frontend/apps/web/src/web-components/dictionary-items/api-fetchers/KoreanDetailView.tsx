import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../shared-web-hooks/useCallAPIWeb";
import { isDetailedKoreanType } from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { useKoreanDetailListenerHandler } from "@repo/shared/hooks/listener-handlers/viewSpecificListenerHandlers";
import { KoreanDetailInteractionData } from "@repo/shared/types/views/interactionDataTypes";
import { BasicAPIDataFormatter } from "../api-result-formatters/BasicAPIDataFormatter";
import { KoreanDetailDisplay } from "../item-components/korean/detail/KoreanDetailDisplay";
import { memo } from "react";

export const KoreanDetailView = memo(
  ({
    target_code,
    interactionData,
  }: {
    target_code: number;
    interactionData: KoreanDetailInteractionData;
  }) => {
    const url = getEndpoint({ endpoint: "detail_korean", pk: target_code });

    const { requestState, refetch } = useFetchProps({
      url: url,
      useCallAPIInstance: useCallAPIWeb({ cacheResults: true }),
      refetchDependencyArray: [target_code],
    });

    useKoreanDetailListenerHandler({
      url: url,
      response: requestState.response,
      refetch: refetch,
    });

    return (
      <BasicAPIDataFormatter
        requestState={requestState}
        verifier={isDetailedKoreanType}
        interactionData={interactionData}
        DisplayComponent={KoreanDetailDisplay}
      />
    );
  }
);
