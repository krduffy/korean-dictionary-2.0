import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../shared-web-hooks/useCallAPIWeb";
import { HanjaDetailDisplay } from "../item-components/hanja/detail/HanjaDetailDisplay";
import { HanjaDetailInteractionData } from "@repo/shared/types/views/interactionDataTypes";
import {
  DetailedHanjaType,
  isDetailedHanjaType,
} from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";
import { useHanjaDetailListenerManager } from "@repo/shared/hooks/listener-handlers/useListenerHandlers";
import { BasicAPIDataFormatter } from "../api-result-formatters/BasicAPIDataFormatter";

export const HanjaDetailView = ({
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

  useHanjaDetailListenerManager({
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
};
