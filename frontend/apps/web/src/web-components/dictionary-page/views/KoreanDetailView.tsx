import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../web-hooks/useCallAPIWeb";
import { LoadingIndicator } from "../../other/misc/LoadingIndicator";
import { KoreanDetailDisplay } from "../dictionary-items/korean/detail/KoreanDetailDisplay";
import { ErrorMessage } from "../../other/misc/ErrorMessage";
import {
  NoResponseError,
  WrongFormatError,
} from "../../other/misc/ErrorMessageTemplates";
import { isDetailedKoreanType } from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { useKoreanDetailListenerManager } from "@repo/shared/hooks/listener-handlers/useListenerHandlers";
import { KoreanDetailInteractionData } from "@repo/shared/types/views/interactionDataTypes";

export const KoreanDetailView = ({
  target_code,
  interactionData,
}: {
  target_code: number;
  interactionData: KoreanDetailInteractionData;
}) => {
  const url = getEndpoint({ endpoint: "detail_korean", pk: target_code });

  const { successful, error, loading, response, refetch } = useFetchProps({
    url: url,
    useAPICallInstance: useCallAPIWeb({ cacheResults: true }),
    refetchDependencyArray: [target_code],
  });

  useKoreanDetailListenerManager({
    url: url,
    response: response,
    refetch: refetch,
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorMessage errorResponse={response} />;
  }

  if (!response) {
    return <NoResponseError />;
  }

  if (!isDetailedKoreanType(response)) {
    return <WrongFormatError />;
  }

  if (successful && response) {
    return (
      <KoreanDetailDisplay data={response} interactionData={interactionData} />
    );
  }
};
