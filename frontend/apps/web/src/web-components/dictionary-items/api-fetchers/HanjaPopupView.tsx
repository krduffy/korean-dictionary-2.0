import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { useCallAPIWeb } from "../../../shared-web-hooks/useCallAPIWeb";
import { BasicAPIDataFormatter } from "../api-result-formatters/BasicAPIDataFormatter";
import { isHanjaPopupDataType } from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";
import { HanjaPopupDisplay } from "../item-components/hanja/HanjaPopupDisplay";

export const HanjaPopupView = ({ character }: { character: string }) => {
  const { requestState } = useFetchProps({
    url: getEndpoint({ endpoint: "popup_hanja", pk: character }),
    useCallAPIInstance: useCallAPIWeb({ cacheResults: true }),
    refetchDependencyArray: [character],
  });

  return (
    /* It is extremely important that this has a constant
       height and width. If not, the popup box will jump as the
       item resizes */
    <div className="h-56 w-56">
      <BasicAPIDataFormatter
        requestState={requestState}
        verifier={isHanjaPopupDataType}
        interactionData={undefined}
        DisplayComponent={HanjaPopupDisplay}
      />
    </div>
  );
};
