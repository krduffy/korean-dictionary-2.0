import { isHanjaPopupDataType } from "@repo/shared/types/typeGuards";
import { ErrorMessage } from "../misc/ErrorMessage";
import { LoadingIndicator } from "../misc/LoadingIndicator";
import { useCallAPIWeb } from "../../../web-hooks/useCallAPIWeb";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useFetchProps } from "@repo/shared/hooks/useFetchProps";
import { HanjaPopupType } from "@repo/shared/types/dictionaryItemProps";
import {
  NoResponseError,
  WrongFormatError,
} from "../misc/ErrorMessageTemplates";

export const HanjaPopupBox = ({ character }: { character: string }) => {
  const { successful, error, loading, response } = useFetchProps({
    url: getEndpoint({ endpoint: "popup_hanja", pk: character }),
    useAPICallInstance: useCallAPIWeb({ cacheResults: true }),
    refetchDependencyArray: [character],
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!response) {
    return <NoResponseError />;
  }

  if (error) {
    return <ErrorMessage errorResponse={response} />;
  }

  if (!isHanjaPopupDataType(response)) {
    return <WrongFormatError />;
  }

  return successful && <HanjaPopupBoxContent data={response} />;
};

export const HanjaPopupBoxContent = ({ data }: { data: HanjaPopupType }) => {
  return <div>{data.character}</div>;
};
