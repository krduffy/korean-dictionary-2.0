import { usePropForm } from "@repo/shared/hooks/usePropForm";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../web-hooks/useCallAPIWeb";
import { LoadingIndicator } from "../../other/misc/LoadingIndicator";
import { ErrorMessage } from "../../other/misc/ErrorMessage";
import { FALLBACK_MAX_TIME_MS } from "@repo/shared/constants";
import { useShowFallback } from "@repo/shared/hooks/useShowFallback";

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

  const { successful, error, loading, response } = usePropForm({
    url: getEndpoint({ endpoint: "find_lemma" }),
    formDataGetter: getFormData,
    useCallAPIInstance: useCallAPIWeb({ cacheResults: true }),
    repostDependencies: [word, sentence],
  });

  const { showFallback } = useShowFallback({
    loading: loading,
    successful: successful,
    fallbackMaxTimeMs: FALLBACK_MAX_TIME_MS,
  });

  if (showFallback || loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorMessage errorResponse={response} />;
  }

  if (response?.found) {
    return <FindLemmaDisplay wordFound={String(response.found)} />;
  }

  return <div>not found</div>;
};

const FindLemmaDisplay = ({ wordFound }: { wordFound: string }) => {
  return (
    <div>
      <div>found {wordFound}</div>
    </div>
  );
};
