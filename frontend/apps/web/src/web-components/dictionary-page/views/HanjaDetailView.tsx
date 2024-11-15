import { useFetchProps } from "@repo/shared/hooks/useFetchProps";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../web-hooks/useCallAPIWeb";
import { LoadingIndicator } from "../../other/misc/LoadingIndicator";
import { HanjaDetailDisplay } from "../dictionary-items/HanjaDetailDisplay";

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
    return <div>error</div>;
  }

  if (successful && response) {
    return <HanjaDetailDisplay data={response} />;
  }
};
