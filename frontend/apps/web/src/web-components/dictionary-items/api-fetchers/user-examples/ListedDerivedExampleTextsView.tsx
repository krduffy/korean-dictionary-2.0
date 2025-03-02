import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../../shared-web-hooks/useCallAPIWeb";
import { isDerivedExampleTextType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { PaginatedResultsFormatter } from "../../api-result-formatters/paginated-results/PaginatedResultsFormatter";
import { ResultCountMessage } from "../../api-result-formatters/paginated-results/ResultsMessages";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { PageChanger } from "../../api-result-formatters/paginated-results/PageChanger";
import { SimpleNotification } from "../../../pages/notifications/SimpleNotification";
import { useNotificationContext } from "@repo/shared/contexts/NotificationContextProvider";
import { useRedirectingPaginatedResults } from "@repo/shared/hooks/api/useRedirectingPaginatedResults";
import { DerivedExampleTextsSearchBar } from "./DerivedExampleTextsSearchBar";
import { ListedDerivedExampleText } from "../../item-components/user-examples/listed-derived-example-text/ListedDerivedExampleText";
import { DerivedExampleTextsTopBar } from "./DerivedExampleTextsTopBar";

export const ListedDerivedExampleTextsView = ({
  searchTerm,
  page,
}: {
  searchTerm: string;
  page: number;
}) => {
  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  const listUrl = getEndpoint({
    endpoint: "derived_examples_texts",
    queryParams: {
      search: searchTerm,
      page: page,
    },
  });

  const { requestState, refetch } = useFetchProps({
    url: listUrl,
    useCallAPIInstance: useCallAPIWeb({ cacheResults: false }),
    refetchDependencyArray: [searchTerm, page],
  });

  const { sendNotification } = useNotificationContext();

  const onRedirect = (newPageNum: number) => {
    sendNotification(
      <SimpleNotification>
        {newPageNum}째 페이지로 옮겼습니다.
      </SimpleNotification>,
      5000
    );
    setPageNum(newPageNum);
  };

  useRedirectingPaginatedResults({
    response: requestState.response,
    requestedPage: page,
    onRedirect: onRedirect,
  });

  const setSearchTerm = (newSearchTerm: string) => {
    panelDispatchStateChangeSelf({
      type: "update_listed_derived_example_texts_interaction_data",
      key: "searchTerm",
      newValue: newSearchTerm,
    });
  };

  const setPageNum = (newPage: number) => {
    panelDispatchStateChangeSelf({
      type: "update_listed_derived_example_texts_interaction_data",
      key: "searchPageNum",
      newValue: newPage,
    });
  };

  return (
    <>
      <div className="pb-8">
        <DerivedExampleTextsTopBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      <ResultCountMessage
        pageNum={page}
        responseCount={requestState?.response?.count}
      />
      <PaginatedResultsFormatter
        requestState={requestState}
        searchTerm={searchTerm}
        verifier={isDerivedExampleTextType}
        ResultComponent={ListedDerivedExampleText}
        additionallyPass={{ refetchList: refetch }}
      />
      <PageChanger
        pageNum={page}
        setPageNum={setPageNum}
        responseCount={requestState?.response?.count}
      />
    </>
  );
};
