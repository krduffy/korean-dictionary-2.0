import { HanjaSearchResultType } from "@repo/shared/types/dictionaryItemProps";
import { PanelSpecificDispatcher } from "../string-formatters/PanelSpecificDispatcher";

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
