import { useFetchProps } from "@repo/shared/hooks/useFetchProps";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../web-hooks/useCallAPIWeb";
import { LoadingIndicator } from "../../other/misc/LoadingIndicator";
import { HanjaDetailDisplay } from "../dictionary-items/hanja/detail/HanjaDetailDisplay";
import { ErrorMessage } from "../../other/misc/ErrorMessage";
import { WrongFormatError } from "../../other/misc/ErrorMessageTemplates";
import { HanjaDetailInteractionData } from "@repo/shared/types/views/interactionDataTypes";
import { isDetailedHanjaType } from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";

export const HanjaDetailView = ({
  character,
  interactionData,
}: {
  character: string;
  interactionData: HanjaDetailInteractionData;
}) => {
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

  return (
    <HanjaDetailDisplay data={response} interactionData={interactionData} />
  );
};
