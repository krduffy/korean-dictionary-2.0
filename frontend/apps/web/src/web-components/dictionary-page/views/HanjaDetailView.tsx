import { useFetchProps } from "@repo/shared/hooks/useFetchProps";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../web-hooks/useCallAPIWeb";
import { LoadingIndicator } from "../../other/misc/LoadingIndicator";
import { HanjaDetailDisplay } from "../dictionary-items/HanjaDetailDisplay";
import { ErrorMessage } from "../../other/misc/ErrorMessage";
import { isDetailedHanjaType } from "@repo/shared/types/typeGuards";
import { WrongFormatError } from "../../other/misc/ErrorMessageTemplates";

export const HanjaDetailView = ({ character }: { character: string }) => {
  const { error, loading, response } = useFetchProps({
    url: getEndpoint({ endpoint: "detail_hanja", pk: character }),
    useAPICallInstance: useCallAPIWeb({ cacheResults: true }),
    refetchDependencyArray: [character],
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorMessage errorResponse={response} />;
  }

  if (!isDetailedHanjaType(response)) {
    return <WrongFormatError />;
  }

  return <HanjaDetailDisplay data={response} />;
};
