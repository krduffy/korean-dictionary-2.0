import { useFetchProps } from "@repo/shared/hooks/useFetchProps";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../web-hooks/useCallAPIWeb";
import { LoadingIndicator } from "../../other/misc/LoadingIndicator";
import { KoreanDetailDisplay } from "../dictionary-items/KoreanDetailDisplay";
import { DetailedKoreanType } from "@repo/shared/types/dictionaryItemProps";
import { ErrorMessage } from "../../other/misc/ErrorMessage";
import { isDetailedKoreanType } from "@repo/shared/types/typeGuards";
import {
  NoResponseError,
  WrongFormatError,
} from "../../other/misc/ErrorMessageTemplates";
import { FALLBACK_MAX_TIME_MS } from "@repo/shared/constants";
import { useShowFallback } from "@repo/shared/hooks/useShowFallback";

export const KoreanDetailView = ({
  target_code,
  dropdownStates,
}: {
  target_code: number;
  dropdownStates: boolean[];
}) => {
  const { successful, error, loading, response } = useFetchProps({
    url: getEndpoint({ endpoint: "detail_korean", pk: target_code }),
    useAPICallInstance: useCallAPIWeb({ cacheResults: true }),
    refetchDependencyArray: [target_code],
  });

  const { showFallback } = useShowFallback({
    loading: loading,
    successful: successful,
    fallbackMaxTimeMs: FALLBACK_MAX_TIME_MS,
  });

  if (showFallback || loading) {
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
