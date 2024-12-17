import { ErrorMessage } from "../misc/ErrorMessage";
import { LoadingIndicator } from "../misc/LoadingIndicator";
import { useCallAPIWeb } from "../../../web-hooks/useCallAPIWeb";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import {
  NoResponseError,
  WrongFormatError,
} from "../misc/ErrorMessageTemplates";
import {
  HanjaPopupType,
  isHanjaPopupDataType,
} from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";

export const HanjaPopupBox = ({ character }: { character: string }) => {
  const { successful, error, loading, response } = useFetchProps({
    url: getEndpoint({ endpoint: "popup_hanja", pk: character }),
    useCallAPIInstance: useCallAPIWeb({ cacheResults: true }),
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
