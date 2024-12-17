import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../web-hooks/useCallAPIWeb";
import { KoreanDetailDisplay } from "../dictionary-page/dictionary-items/korean/detail/KoreanDetailDisplay";
import {
  DetailedKoreanType,
  isDetailedKoreanType,
} from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { useKoreanDetailListenerManager } from "@repo/shared/hooks/listener-handlers/useListenerHandlers";
import { KoreanDetailInteractionData } from "@repo/shared/types/views/interactionDataTypes";
import { BasicAPIDataFormatter } from "../api-data-formatters/BasicAPIDataFormatter";

export const KoreanDetailView = ({
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

  useKoreanDetailListenerManager({
    url: url,
    response: requestState.response,
    refetch: refetch,
  });

  return (
    <BasicAPIDataFormatter
      requestState={requestState}
      verifier={isDetailedKoreanType}
      DisplayComponent={({ data }: { data: DetailedKoreanType }) => {
        return (
          <KoreanDetailDisplay data={data} interactionData={interactionData} />
        );
      }}
    />
  );
};
