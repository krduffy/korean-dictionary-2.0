import { RequestStateType } from "@repo/shared/types/apiCallTypes";
import { isHanjaPopupDataType } from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";
import { HanjaPopupDisplay } from "../item-components/hanja/HanjaPopupDisplay";
import { BasicAPIDataFormatter } from "./BasicAPIDataFormatter";

export const HanjaPopupDataFormatter = ({
  requestState,
}: {
  requestState: RequestStateType;
}) => {
  /* It is extremely important that this has a minimum
       height and width. If not, the popup box will jump as the
       item resizes almost every time. */
  return (
    <div className="min-h-56 min-w-56">
      <BasicAPIDataFormatter
        requestState={requestState}
        verifier={isHanjaPopupDataType}
        interactionData={undefined}
        DisplayComponent={HanjaPopupDisplay}
      />
    </div>
  );
};
