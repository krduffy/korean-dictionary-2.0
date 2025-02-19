import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import { getUserExampleEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../../shared-web-hooks/useCallAPIWeb";
import { UserExamplesFormatter } from "../../api-result-formatters/user-examples-formatter/UserExamplesFormatter";
import {
  UserVideoExampleType,
  isUserVideoExampleType,
} from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { ListedVideoComponent } from "../../item-components/user-examples/video-example/ListedVideoComponent";
import {
  UserExamplesContextProvider,
  UserVideoExampleContextType,
} from "./UserExamplesContextProvider";

export const VideoUserExamplesView = ({
  headwordTargetCode,
}: {
  headwordTargetCode: number;
}) => {
  const listUrl = getUserExampleEndpoint({
    exampleType: "video",
    headwordTargetCode: headwordTargetCode,
  });

  const { requestState, refetch } = useFetchProps({
    url: listUrl,
    useCallAPIInstance: useCallAPIWeb({ cacheResults: false }),
    refetchDependencyArray: [],
  });

  return (
    <UserExamplesContextProvider<UserVideoExampleContextType>
      contextValue={{
        type: "video",
        ListedFormComponent: ListedVideoComponent,
        verifier: isUserVideoExampleType,
        emptyDataTypeTemplate: {
          video_id: "",
          start: 0,
          end: 0,
          source: "",
          video_text: "",
        },
      }}
    >
      <UserExamplesFormatter<UserVideoExampleType>
        requestState={requestState}
      />
    </UserExamplesContextProvider>
  );
};
