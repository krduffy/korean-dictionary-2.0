import { HanjaSearchResultType } from "@repo/shared/types/dictionaryItemProps";
import { PanelSpecificDispatcher } from "../panel/PanelSpecificDispatcher";

export const HanjaSearchResult = ({
  result,
}: {
  result: HanjaSearchResultType;
}) => {
  return (
    <div>
      <PanelSpecificDispatcher
        panelStateAction={{
          type: "push_hanja_detail",
          character: result.character,
        }}
      >
        {result.character}
      </PanelSpecificDispatcher>
    </div>
  );
};
