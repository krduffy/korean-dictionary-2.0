import { isHanjaPopupDataType } from "@repo/shared/types/typeGuards";
import { ErrorMessage } from "../misc/ErrorMessage";
import { LoadingIndicator } from "../misc/LoadingIndicator";
import { useCallAPIWeb } from "../../../web-hooks/useCallAPIWeb";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useFetchProps } from "@repo/shared/hooks/useFetchProps";

export const HanjaPopupBox = ({ character }: { character: string }) => {
  const { successful, error, loading, response } = useFetchProps({
    url: getEndpoint({ endpoint: "popup_hanja", pk: character }),
    useAPICallInstance: useCallAPIWeb({ cacheResults: true }).useCallAPIReturns,
    refetchDependencyArray: [character],
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorMessage errorResponse={response} />;
  }

  if (!response) {
    return (
      <ErrorMessage errorResponse={{ 오류: "api 요청은 응답이 없었습니다." }} />
    );
  }

  if (!isHanjaPopupDataType(response)) {
    return (
      <ErrorMessage
        errorResponse={{ 오류: "api 응답은 데이터 구조가 안 됩니다." }}
      />
    );
  }

  return successful && <HanjaPopupBoxContent data={response} />;
};

export const HanjaPopupBoxContent = ({ data }: { data: HanjaPopupType }) => {
  return <div>{data.character}</div>;
};
