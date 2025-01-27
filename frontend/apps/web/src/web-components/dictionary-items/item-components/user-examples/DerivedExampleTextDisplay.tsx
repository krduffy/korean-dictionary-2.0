import { DerivedExampleTextType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { DerivedExampleTextInteractionData } from "@repo/shared/types/views/interactionDataTypes";
import { Sparkles } from "lucide-react";
import { useSettingsContext } from "../../../../web-contexts/SettingsContext";
import { DerivedExampleTextDetailListedHeadwordsView } from "../../api-fetchers/DerivedExampleTextDetailListedHeadwordsView";
import { DerivedExampleTextSourceText } from "./DerivedExampleTextSourceText";

export const DerivedExampleTextDisplay = ({
  data,
  interactionData,
}: {
  data: DerivedExampleTextType;
  interactionData: DerivedExampleTextInteractionData;
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      <DerivedExampleTextDisplayMainContent
        text={data.text}
        source={data.source}
        highlightEojeolNumOnLoad={interactionData.highlightEojeolNumOnLoad}
      />

      <div className="w-full sm:flex-grow-0 sm:flex-shrink sm:min-w-24 sm:max-w-[50%]">
        <DerivedExampleTextDisplaySideBar
          sourceTextPk={data.id}
          interactionData={interactionData}
          imageUrl={data.image_url}
        />
      </div>
    </div>
  );
};

const DerivedExampleTextDisplaySideBar = ({
  sourceTextPk,
  interactionData,
  imageUrl,
}: {
  sourceTextPk: number;
  interactionData: DerivedExampleTextInteractionData;
  imageUrl: string | undefined;
}) => {
  return (
    <aside
      className="w-full sm:p-4 rounded-lg bg-[color:--background-tertiary]
      flex flex-col justify-center items-center"
      aria-label="derived-example-text-display-side-bar"
    >
      {imageUrl !== undefined && (
        <img className="min-h-16 max-h-64 object-fill" src={imageUrl}></img>
      )}
      <ContainedHeadwordsSection
        sourceTextPk={sourceTextPk}
        interactionData={interactionData}
      />
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
    <div>
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

const DerivedExampleTextDisplayMainContent = ({
  text,
  source,
  highlightEojeolNumOnLoad,
}: {
  text: string;
  source: string;
  highlightEojeolNumOnLoad: number | null;
}) => {
  const { fontSizeSettings } = useSettingsContext();

  return (
    <section aria-label="derived-example-text-display-main-content">
      <h2 className="flex flex-row gap-2 items-center text-[200%] pb-8">
        <Sparkles size={fontSizeSettings.relativeFontSize * 32} />
        {source}
      </h2>
      <DerivedExampleTextSourceText
        text={text}
        highlightEojeolNumOnLoad={highlightEojeolNumOnLoad}
      />
    </section>
  );
};
