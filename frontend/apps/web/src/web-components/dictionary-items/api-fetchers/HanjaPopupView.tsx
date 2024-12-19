import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../shared-web-hooks/useCallAPIWeb";
import { HanjaPopupDataFormatter } from "../api-result-formatters/HanjaPopupDataFormatter";

export const HanjaPopupView = ({ character }: { character: string }) => {
  const { requestState } = useFetchProps({
    url: getEndpoint({ endpoint: "popup_hanja", pk: character }),
    useCallAPIInstance: useCallAPIWeb({ cacheResults: true }),
    refetchDependencyArray: [character],
  });

  return <HanjaPopupDataFormatter requestState={requestState} />;
};
