import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../shared-web-hooks/useCallAPIWeb";
import { ResultCountMessage } from "../api-result-formatters/paginated-results/ResultsMessages";
import { PageChanger } from "../api-result-formatters/paginated-results/PageChanger";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { PaginatedResultsFormatter } from "../api-result-formatters/paginated-results/PaginatedResultsFormatter";
import { useRedirectingPaginatedResults } from "@repo/shared/hooks/api/useRedirectingPaginatedResults";
import { isDerivedExampleTextHeadwordFromTextType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { DerivedExampleTextHeadwordFromText } from "../item-components/user-examples/derived-example-text/DerivedExampleTextHeadwordFromText";

import { memo } from "react";
import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import { useNotificationContext } from "@repo/shared/contexts/NotificationContextProvider";
import { SimpleNotification } from "../../pages/notifications/SimpleNotification";

export const DerivedExampleTextDetailListedHeadwordsView = memo(
  ({
    sourceTextPk,
    pageNum,
    onlyUnknown,
  }: {
    sourceTextPk: number;
    pageNum: number;
    onlyUnknown: boolean;
  }) => {
    const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

    const url = getEndpoint({
      endpoint: "get_derived_example_lemmas_from_text",
      pk: sourceTextPk,
      queryParams: {
        page: pageNum,
        only_unknown: onlyUnknown,
      },
    });

    const setPageNum = (newPage: number) => {
      panelDispatchStateChangeSelf({
        type: "update_derived_example_text_interaction_data",
        key: "headwordSearchPanelPageNum",
        newValue: newPage,
      });
    };

    const { sendNotification } = useNotificationContext();

    const onRedirect = (newPageNum: number) => {
      sendNotification(<SimpleNotification>redirect</SimpleNotification>, 5000);
      setPageNum(newPageNum);
    };

    const { requestState } = useFetchProps({
      url: url,
      useCallAPIInstance: useCallAPIWeb({ cacheResults: false }),
      refetchDependencyArray: [url],
    });

    useRedirectingPaginatedResults({
      response: requestState.response,
      requestedPage: pageNum,
      onRedirect: onRedirect,
    });

    return (
      <>
        <ResultCountMessage
          pageNum={pageNum}
          responseCount={requestState?.response?.count}
        />

        <PaginatedResultsFormatter
          requestState={requestState}
          verifier={isDerivedExampleTextHeadwordFromTextType}
          ResultComponent={DerivedExampleTextHeadwordFromText}
        />

        <PageChanger
          pageNum={pageNum}
          setPageNum={setPageNum}
          responseCount={requestState?.response?.count}
        />
      </>
    );
  }
);
