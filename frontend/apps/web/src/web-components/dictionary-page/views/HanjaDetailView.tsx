import { useFetchProps } from "@repo/shared/hooks/useFetchProps";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../web-hooks/useCallAPIWeb";
import { LoadingIndicator } from "../../other/misc/LoadingIndicator";
import { HanjaDetailDisplay } from "../dictionary-items/HanjaDetailDisplay";
import { ErrorMessage } from "../../other/misc/ErrorMessage";
import { DetailedHanjaType } from "@repo/shared/types/dictionaryItemProps";

export const HanjaDetailView = ({ character }: { character: string }) => {
  const { successful, error, loading, response } = useFetchProps({
    url: getEndpoint({ endpoint: "detail_hanja", pk: character }),
    useAPICallInstance: useCallAPIWeb({ cacheResults: true }).useCallAPIReturns,
    refetchDependencyArray: [character],
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorMessage errorResponse={response} />;
  }

  if (successful && response) {
    return (
      <HanjaDetailDisplay data={response as unknown as DetailedHanjaType} />
    );
  }
};
