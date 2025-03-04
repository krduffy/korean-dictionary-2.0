import { DerivedExampleTextType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { DerivedExampleTextInteractionData } from "@repo/shared/types/views/interactionDataTypes";
import { Sparkles } from "lucide-react";
import { useSettingsContext } from "../../../../../web-contexts/SettingsContext";
import { DerivedExampleTextDetailListedHeadwordsView } from "../../../api-fetchers/DerivedExampleTextDetailListedHeadwordsView";
import { DerivedExampleTextSourceText } from "./DerivedExampleTextSourceText";
import { useRef, memo } from "react";
import { useWidthObserver } from "../../../../../shared-web-hooks/useWidthObserver";
import { DerivedExampleTextContextProvider } from "./DerivedExampleTextContext";
import { useDerivedExampleTextDisplayMainContent } from "./useDerivedExampleTextDisplayMainContent";

export const DerivedExampleTextDisplay = ({
  data,
  interactionData,
}: {
  data: DerivedExampleTextType;
  interactionData: DerivedExampleTextInteractionData;
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const { belowCutoff } = useWidthObserver({ ref: divRef, cutoff: 500 });

  return (
    <DerivedExampleTextContextProvider sourceTextPk={data.id}>
      <div
        className={`flex flex-${belowCutoff ? "col" : "row"} gap-4 justify-between`}
        ref={divRef}
      >
        <DerivedExampleTextDisplayMainContent
          text={data.text}
          source={data.source}
          highlightEojeolNumOnLoad={interactionData.highlightEojeolNumOnLoad}
        />

        <div
          className={`w-full ${belowCutoff ? "" : "flex-grow-0 flex-shrink min-w-[30%] max-w-[40%]"}`}
        >
          <DerivedExampleTextDisplaySideBar
            sourceTextPk={data.id}
            interactionData={interactionData}
            imageUrl={data.image_url}
          />
        </div>
      </div>
    </DerivedExampleTextContextProvider>
  );
};

const DerivedExampleTextDisplaySideBar = ({
  sourceTextPk,
  interactionData,
  imageUrl,
}: {
  sourceTextPk: number;
  interactionData: DerivedExampleTextInteractionData;
  imageUrl: string | null;
}) => {
  const { includeUnknownWordsInDerivedTextPageViewSettings } =
    useSettingsContext();

  if (
    imageUrl === null &&
    !includeUnknownWordsInDerivedTextPageViewSettings.doInclude
  )
    return;

  return (
    <aside
      className="w-full p-4 rounded-lg bg-[color:--background-tertiary]
      flex flex-col justify-center items-center"
      aria-label="derived-example-text-display-side-bar"
    >
      {imageUrl !== null && (
        <img className="min-h-16 max-h-64 object-fill" src={imageUrl}></img>
      )}
      {includeUnknownWordsInDerivedTextPageViewSettings.doInclude && (
        <ContainedHeadwordsSection
          sourceTextPk={sourceTextPk}
          interactionData={interactionData}
        />
      )}
    </aside>
  );
};

const ContainedHeadwordsSection = ({
  sourceTextPk,
  interactionData,
}: {
  sourceTextPk: number;
  interactionData: DerivedExampleTextInteractionData;
}) => {
  return (
    <div className="w-full">
      <h3 className="text-[150%] text-[color:--accent-3] text-center p-4">
        본문의 모르는 단어
      </h3>
      <DerivedExampleTextDetailListedHeadwordsView
        sourceTextPk={sourceTextPk}
        pageNum={interactionData.headwordSearchPanelPageNum}
        onlyUnknown={interactionData.headwordSearchPanelOnlyUnknownSet}
      />
    </div>
  );
};

const DerivedExampleTextDisplayMainContent = memo(
  ({
    text,
    source,
    highlightEojeolNumOnLoad,
  }: {
    text: string;
    source: string;
    highlightEojeolNumOnLoad: number | null;
  }) => {
    const { fontSizeSettings } = useSettingsContext();

    useDerivedExampleTextDisplayMainContent({
      highlightEojeolNumOnLoad: highlightEojeolNumOnLoad,
    });

    return (
      <section aria-label="derived-example-text-display-main-content">
        <h2 className="flex flex-row gap-2 items-center text-[200%] pb-8">
          <Sparkles size={fontSizeSettings.relativeFontSize * 32} />
          {source}
        </h2>
        <DerivedExampleTextSourceText text={text} />
      </section>
    );
  }
);
