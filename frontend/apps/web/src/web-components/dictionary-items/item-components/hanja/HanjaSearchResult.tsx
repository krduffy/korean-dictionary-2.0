import { PanelSpecificDispatcher } from "../../../pages/dictionary-page/PanelSpecificDispatcher";
import { memo } from "react";
import { HanjaCharacterKnownStudiedTogglers } from "../shared/known-studied/KnownStudiedDisplayers";
import { HanjaSearchResultType } from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";
import { MeaningReadingsDisplay } from "./MeaningReadingsDisplay";
import {
  DetailViewLinkStyler,
  Href,
  Source,
} from "../../../text-formatters/SpanStylers";

export const HanjaSearchResult = memo(
  ({ result }: { result: HanjaSearchResultType }) => {
    return (
      <>
        <HanjaSearchResultTopInfo result={result} />

        <div className="text-ellipsis whitespace-nowrap w-full overflow-hidden">
          {result.explanation}
        </div>

        <br />

        <HanjaSearchResultSource character={result.character} />
      </>
    );
  }
);

const HanjaSearchResultTopInfo = ({
  result,
}: {
  result: HanjaSearchResultType;
}) => {
  return (
    <div className="flex flex-row items-center justify-between pb-8">
      <div className="flex flex-row gap-4 items-center">
        <div className="[color:--accent-1] text-[200%]">
          <PanelSpecificDispatcher
            panelStateAction={{
              type: "push_hanja_detail",
              character: result.character,
            }}
          >
            <DetailViewLinkStyler>{result.character}</DetailViewLinkStyler>
          </PanelSpecificDispatcher>
        </div>
        <MeaningReadingsDisplay meaningReadings={result.meaning_readings} />
      </div>
      <div className="flex flex-row gap-2">
        <div>{result.exam_level}</div>
        <div>{result.strokes}획</div>
      </div>
      {result.user_data ? (
        <div>
          <HanjaCharacterKnownStudiedTogglers
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
  );
};

const HanjaSearchResultSource = ({ character }: { character: string }) => {
  return (
    <footer>
      <Source>
        출처:{" "}
        <Href urlString={`https://namu.wiki/w/${character}`}>나무위키</Href>
      </Source>
    </footer>
  );
};
