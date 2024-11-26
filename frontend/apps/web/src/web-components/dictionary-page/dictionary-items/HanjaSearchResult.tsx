import { HanjaSearchResultType } from "@repo/shared/types/dictionaryItemProps";
import { PanelSpecificDispatcher } from "../panel/PanelSpecificDispatcher";
import { memo } from "react";

export const HanjaSearchResult = memo(
  ({ result }: { result: HanjaSearchResultType }) => {
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
  }
);
