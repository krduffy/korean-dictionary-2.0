import { HanjaSearchResultType } from "@repo/shared/types/dictionaryItemProps";
import { PanelSpecificDispatcher } from "../../../dictionary-page/panel/PanelSpecificDispatcher";
import { memo } from "react";
import { HanjaTogglers } from "../known-studied/KnownStudiedTogglers";
import { MeaningReadingsDiv } from "../ReusedFormatters";

export const HanjaSearchResult = memo(
  ({ result }: { result: HanjaSearchResultType }) => {
    return (
      <>
        <div className="flex flex-row items-center justify-between pb-8">
          <div className="flex flex-row gap-4 items-center">
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
            <MeaningReadingsDiv meaningReadings={result.meaning_readings} />
          </div>
          <div className="flex flex-row gap-2">
            <div>{result.exam_level}</div>
            <div>{result.strokes}획</div>
          </div>
          {result.user_data ? (
            <div>
              <HanjaTogglers
                pk={result.character}
                initiallyKnown={result.user_data.is_known}
                initiallyStudied={result.user_data.is_studied}
              />
            </div>
          ) : (
            /* this is here just to force the above div with exam level etc to not be at the
               end when user data is null. (justify between) */
            <div />
          )}
        </div>
        <div className="text-ellipsis whitespace-nowrap w-full overflow-hidden">
          {result.explanation}
        </div>
      </>
    );
  }
);
