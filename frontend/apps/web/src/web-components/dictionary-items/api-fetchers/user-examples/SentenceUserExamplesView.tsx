import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import { getUserExampleEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../../shared-web-hooks/useCallAPIWeb";
import { UserExamplesFormatter } from "../../api-result-formatters/user-examples-formatter/UserExamplesFormatter";
import {
  UserVideoExampleType,
  isUserExampleSentenceType,
} from "@repo/shared/types/views/dictionary-items/userExampleItems";
import {
  UserExamplesContextProvider,
  UserExampleSentenceContextType,
} from "./UserExamplesContextProvider";
import { ListedSentenceComponent } from "../../item-components/user-examples/sentence-example/ListedSentenceComponent";

export const SentenceUserExamplesView = ({
  headwordTargetCode,
  droppedDown,
}: {
  headwordTargetCode: number;
  droppedDown: boolean;
}) => {
  const listUrl = getUserExampleEndpoint({
    exampleType: "sentence",
    headwordTargetCode: headwordTargetCode,
  });

  const { requestState, refetch } = useFetchProps({
    url: listUrl,
    useCallAPIInstance: useCallAPIWeb({ cacheResults: false }),
    refetchDependencyArray: [],
  });

  return (
    <UserExamplesContextProvider<UserExampleSentenceContextType>
      contextValue={{
        headwordTargetCode: headwordTargetCode,
        type: "sentence",
        title: "추가한 문장",
        droppedDown: droppedDown,
        ListedFormComponent: ListedSentenceComponent,
        verifier: isUserExampleSentenceType,
        emptyDataTypeTemplate: {
          sentence: "",
          source: "",
        },
      }}
    >
      <UserExamplesFormatter<UserVideoExampleType>
        requestState={requestState}
      />
    </UserExamplesContextProvider>
  );
};
