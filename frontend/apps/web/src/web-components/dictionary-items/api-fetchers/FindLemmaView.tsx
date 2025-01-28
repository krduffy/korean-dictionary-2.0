import { usePropForm } from "@repo/shared/hooks/api/usePropForm";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { useEffect } from "react";
import { useNotificationContext } from "@repo/shared/contexts/NotificationContextProvider";
import { hasBatchim } from "@repo/shared/utils/koreanLangUtils";
import { useCallAPIWeb } from "../../../shared-web-hooks/useCallAPIWeb";
import { ReplacedViewFormatter } from "../api-result-formatters/ReplacedViewFormatter";
import { Footnote } from "../../text-formatters/SpanStylers";
import { SimpleNotification } from "../../pages/notifications/SimpleNotification";

export const FindLemmaView = ({
  word,
  sentence,
  index,
}: {
  word: string;
  sentence: string;
  index: number;
}) => {
  const getFormData = () => {
    return {
      mouse_over: word,
      sentence: sentence,
      index: index,
    };
  };

  const { requestState } = usePropForm({
    url: getEndpoint({ endpoint: "find_lemma" }),
    formDataGetter: getFormData,
    useCallAPIInstance: useCallAPIWeb({ cacheResults: true }),
    repostDependencies: [word, sentence, index],
  });

  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();
  const { sendNotification } = useNotificationContext();

  /* If a word is found then this view will redirect to a new view for showing the
     korean search results using the word that was found */
  useEffect(() => {
    if (requestState.response?.found) {
      const found = String(requestState.response.found);

      sendNotification(<FoundWordNotification word={found} />, 4000);
      panelDispatchStateChangeSelf({
        type: "push_korean_search",
        searchConfig: {
          page: 1,
          search_term: found,
          search_type: "word_exact",
        },
        overwriteCurrentView: true,
      });
    }
  }, [requestState]);

  return <ReplacedViewFormatter requestState={requestState} />;
};

const FoundWordNotification = ({ word }: { word: string }) => {
  const wordHasBatchim = hasBatchim(word);
  const subjectMarker =
    wordHasBatchim === true ? "이" : wordHasBatchim === false ? "가" : "";

  return (
    <SimpleNotification>
      단어 "{word}"{subjectMarker} 검색되었습니다.
      <div>
        <Footnote>이 알림은 설정에 차단하실 수 있습니다</Footnote>
      </div>
    </SimpleNotification>
  );
};
