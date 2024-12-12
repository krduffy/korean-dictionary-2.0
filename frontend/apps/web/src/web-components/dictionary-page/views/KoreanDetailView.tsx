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

export const KoreanDetailView = ({
  target_code,
  dropdownStates,
}: {
  target_code: number;
  dropdownStates: boolean[];
}) => {
  const url = getEndpoint({ endpoint: "detail_korean", pk: target_code });

  const { successful, error, loading, response } = useFetchProps({
    url: url,
    useAPICallInstance: useCallAPIWeb({ cacheResults: true }),
    refetchDependencyArray: [target_code],
  });

  useKoreanDetailListenerManager({
    url: url,
    response: response,
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
      <KoreanDetailDisplay data={response} dropdownStates={dropdownStates} />
    );
  }
};
