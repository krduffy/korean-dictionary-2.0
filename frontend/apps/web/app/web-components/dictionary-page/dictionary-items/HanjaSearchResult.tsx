import { HanjaSearchResultType } from "@repo/shared/types/dictionaryItemProps";
import { PanelStateAction, View } from "@repo/shared/types/panelAndViewTypes";

export const HanjaSearchResult = ({
  result,
  dispatchToTargetPanel,
}: {
  result: HanjaSearchResultType;
  dispatchToTargetPanel: (
    e: React.MouseEvent,
    action: PanelStateAction
  ) => void;
}) => {
  return (
    <div>
      {result.character}
      <button
        onClick={(e) => {
          dispatchToTargetPanel(e, {
            type: "push_hanja_detail",
            character: result.character,
          });
        }}
      >
        see
      </button>
    </div>
  );
};
