import { usePropForm } from "@repo/shared/hooks/usePropForm";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../web-hooks/useCallAPIWeb";
import { LoadingIndicator } from "../../other/misc/LoadingIndicator";
import { ErrorMessage } from "../../other/misc/ErrorMessage";
import { useViewDispatchersContext } from "../../../web-contexts/ViewDispatchersContext";
import {
  NoResponseError,
  WrongFormatError,
} from "../../other/misc/ErrorMessageTemplates";
import { useEffect } from "react";
import { useNotificationContext } from "../../../web-contexts/NotificationContextProvider";
import { hasBatchim } from "@repo/shared/utils/koreanLangUtils";
import { Footnote } from "../../other/string-formatters/SpanStylers";

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
  const { sendNotification } = useNotificationContext();

  useEffect(() => {
    if (response?.found) {
      const found = String(response.found);

      sendNotification(<FoundWordNotification word={found} />, 4000);
      dispatch({
        type: "push_find_lemma_success",
        word: found,
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

const FoundWordNotification = ({ word }: { word: string }) => {
  const wordHasBatchim = hasBatchim(word);
  const subjectMarker =
    wordHasBatchim === true ? "이" : wordHasBatchim === false ? "가" : "";

  return (
    <div className="text-center">
      단어 "{word}"{subjectMarker} 검색되었습니다.
      <div>
        <Footnote string="이 알림은 설정에 차단하실 수 있습니다." />
      </div>
    </div>
  );
};
