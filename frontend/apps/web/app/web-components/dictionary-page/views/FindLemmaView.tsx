import { usePropForm } from "@repo/shared/hooks/usePropForm";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "app/web-hooks/useCallAPIWeb";
import { LoadingIndicator } from "../string-formatters/LoadingIndicator";

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
    useCallAPIInstance: useCallAPIWeb({ cacheResults: true }).useCallAPIReturns,
    repostDependencies: [word, sentence],
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <div>error</div>;
  }

  if (response?.found) {
    return <FindLemmaDisplay wordFound={response.found} />;
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
