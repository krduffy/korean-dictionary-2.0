import { HanjaSearchResultType } from "@repo/shared/types/dictionaryItemProps";
import { ViewDispatchersType } from "../Panel";
import { PanelSpecificDispatcher } from "../string-formatters/PanelSpecificDispatcher";

export const HanjaSearchResult = ({
  result,
  viewDispatchers,
}: {
  result: HanjaSearchResultType;
  viewDispatchers: ViewDispatchersType;
}) => {
  return (
    <div>
      <PanelSpecificDispatcher
        dispatch={viewDispatchers.dispatch}
        dispatchInOtherPanel={viewDispatchers.dispatchInOtherPanel}
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
