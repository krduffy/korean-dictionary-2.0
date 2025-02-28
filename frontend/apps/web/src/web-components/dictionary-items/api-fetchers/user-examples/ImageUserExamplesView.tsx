import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import { getUserExampleEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../../shared-web-hooks/useCallAPIWeb";
import { UserExamplesFormatter } from "../../api-result-formatters/user-examples-formatter/UserExamplesFormatter";
import {
  UserVideoExampleType,
  isUserImageExampleType,
} from "@repo/shared/types/views/dictionary-items/userExampleItems";
import {
  UserExamplesContextProvider,
  UserImageExampleContextType,
} from "./UserExamplesContextProvider";
import { ListedImageComponent } from "../../item-components/user-examples/image-example/ListedImageComponent";

export const ImageUserExamplesView = ({
  headwordTargetCode,
  droppedDown,
}: {
  headwordTargetCode: number;
  droppedDown: boolean;
}) => {
  const listUrl = getUserExampleEndpoint({
    exampleType: "image",
    headwordTargetCode: headwordTargetCode,
  });

  const { requestState, refetch } = useFetchProps({
    url: listUrl,
    useCallAPIInstance: useCallAPIWeb({ cacheResults: false }),
    refetchDependencyArray: [],
  });

  return (
    <UserExamplesContextProvider<UserImageExampleContextType>
      contextValue={{
        headwordTargetCode: headwordTargetCode,
        type: "image",
        title: "추가한 이미지",
        droppedDown: droppedDown,
        ListedFormComponent: ListedImageComponent,
        verifier: isUserImageExampleType,
        emptyDataTypeTemplate: {
          image_url: "",
          source: "",
          image_accompanying_text: "",
        },
      }}
    >
      <UserExamplesFormatter<UserVideoExampleType>
        requestState={requestState}
      />
    </UserExamplesContextProvider>
  );
};
