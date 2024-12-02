import { HanjaSearchResultType } from "@repo/shared/types/dictionaryItemProps";
import { PanelSpecificDispatcher } from "../panel/PanelSpecificDispatcher";
import { memo } from "react";
import { HanjaTogglers } from "./known-studied/KnownStudiedTogglers";

export const HanjaSearchResult = memo(
  ({ result }: { result: HanjaSearchResultType }) => {
    return (
      <>
        <div className="flex flex-row items-center justify-between pb-8">
          <div className="[color:--accent-1] text-[200%] cursor-pointer">
            <PanelSpecificDispatcher
              panelStateAction={{
                type: "push_hanja_detail",
                character: result.character,
              }}
            >
              {result.character}
            </PanelSpecificDispatcher>
          </div>
          <div>
            {result.meaning_readings.map((mr, id) => (
              <div key={id}>
                <span>{mr.meaning} </span>
                <span>{mr.readings.join("/")}</span>
              </div>
            ))}
          </div>
          <div>{result.exam_level}</div>
          <div>{result.strokes}획</div>
          {result.user_data && (
            <div>
              <HanjaTogglers
                pk={result.character}
                initiallyKnown={result.user_data.is_known}
                initiallyStudied={result.user_data.is_studied}
              />
            </div>
          )}
        </div>
        <div className="text-ellipsis whitespace-nowrap w-full overflow-hidden">
          {result.explanation}
        </div>
      </>
    );
  }
);
