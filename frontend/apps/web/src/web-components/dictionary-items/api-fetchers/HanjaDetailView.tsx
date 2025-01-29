import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../shared-web-hooks/useCallAPIWeb";
import { HanjaDetailDisplay } from "../item-components/hanja/detail/HanjaDetailDisplay";
import { HanjaDetailInteractionData } from "@repo/shared/types/views/interactionDataTypes";
import { isDetailedHanjaType } from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";
import { useHanjaDetailListenerHandler } from "@repo/shared/hooks/listener-handlers/viewSpecificListenerHandlers";
import { BasicAPIDataFormatter } from "../api-result-formatters/BasicAPIDataFormatter";
import { memo } from "react";

export const HanjaDetailView = memo(
  ({
    character,
    interactionData,
  }: {
    character: string;
    interactionData: HanjaDetailInteractionData;
  }) => {
    const url = getEndpoint({ endpoint: "detail_hanja", pk: character });

    const { requestState, refetch } = useFetchProps({
      url: url,
      useCallAPIInstance: useCallAPIWeb({ cacheResults: true }),
      refetchDependencyArray: [character],
    });

    useHanjaDetailListenerHandler({
      url,
      response: requestState.response,
      refetch,
    });

    return (
      <BasicAPIDataFormatter
        requestState={requestState}
        verifier={isDetailedHanjaType}
        interactionData={interactionData}
        DisplayComponent={HanjaDetailDisplay}
      />
    );
  }
);
