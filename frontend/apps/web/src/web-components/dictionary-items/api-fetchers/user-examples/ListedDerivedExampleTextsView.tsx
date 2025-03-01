import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import {
  getEndpoint,
  getUserExampleEndpoint,
} from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../../shared-web-hooks/useCallAPIWeb";
import { UserExamplesFormatter } from "../../api-result-formatters/user-examples-formatter/UserExamplesFormatter";
import {
  UserVideoExampleType,
  isDerivedExampleTextType,
  isUserExampleSentenceType,
} from "@repo/shared/types/views/dictionary-items/userExampleItems";
import {
  UserExamplesContextProvider,
  UserExampleSentenceContextType,
} from "./UserExamplesContextProvider";
import { ListedSentenceComponent } from "../../item-components/user-examples/sentence-example/ListedSentenceComponent";
import { PaginatedResultsFormatter } from "../../api-result-formatters/paginated-results/PaginatedResultsFormatter";
import { ListedDerivedExampleText } from "../../item-components/user-examples/listed-derived-example-text/ListedDerivedExampleText";

export const ListedDerivedExampleTextsView = ({
  searchTerm,
  page,
}: {
  searchTerm: string;
  page: number;
}) => {
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
    refetchDependencyArray: [],
  });

  return (
    <PaginatedResultsFormatter
      requestState={requestState}
      searchTerm={searchTerm}
      verifier={isDerivedExampleTextType}
      ResultComponent={ListedDerivedExampleText}
    />
  );
};
