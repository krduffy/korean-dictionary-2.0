import { usePropForm } from "@repo/shared/hooks/usePropForm";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../web-hooks/useCallAPIWeb";
import { LoadingIndicator } from "../../other/misc/LoadingIndicator";
import { ErrorMessage } from "../../other/misc/ErrorMessage";
import { FALLBACK_MAX_TIME_MS } from "@repo/shared/constants";
import { useShowFallback } from "@repo/shared/hooks/useShowFallback";
import { useViewDispatchersContext } from "../../../web-contexts/ViewDispatchersContext";
import {
  NoResponseError,
  WrongFormatError,
} from "../../other/misc/ErrorMessageTemplates";
import { useEffect } from "react";

export const FindLemmaView = ({
  word,
  sentence,
}: {
  word: string;
  sentence: string;
}) => {
  const getFormData = () => {
    return {
      mouse_over: word,
      sentence: sentence,
    };
  };

  const { error, loading, response } = usePropForm({
    url: getEndpoint({ endpoint: "find_lemma" }),
    formDataGetter: getFormData,
    useCallAPIInstance: useCallAPIWeb({ cacheResults: true }),
    repostDependencies: [word, sentence],
  });

  const { dispatch } = useViewDispatchersContext();

  useEffect(() => {
    if (response?.found) {
      dispatch({
        type: "push_find_lemma_success",
        word: String(response.found),
      });
    }
  }, [response]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorMessage errorResponse={response} />;
  }

  if (!response) {
    return <NoResponseError />;
  }

  if (!response.found) {
    return <WrongFormatError />;
  }
};
