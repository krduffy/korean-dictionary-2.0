import { useFetchProps } from "@repo/shared/hooks/useFetchProps";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "app/web-hooks/useCallAPIWeb";
import { LoadingIndicator } from "../string-formatters/LoadingIndicator";
import { KoreanDetailDisplay } from "../dictionary-items/KoreanDetailDisplay";

export const KoreanDetailView = ({ target_code }: { target_code: number }) => {
  const { successful, error, loading, response } = useFetchProps({
    url: getEndpoint({ endpoint: "detail_korean", pk: target_code }),
    useAPICallInstance: useCallAPIWeb().useCallAPIReturns,
    refetchDependencyArray: [target_code],
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <div>error</div>;
  }

  if (successful && response) {
    return <KoreanDetailDisplay data={response} />;
  }
};
