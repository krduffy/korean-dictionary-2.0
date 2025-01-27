import { DerivedExampleTextType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { DerivedExampleTextInteractionData } from "@repo/shared/types/views/interactionDataTypes";
import { Source } from "../../../text-formatters/SpanStylers";
import { Sparkles } from "lucide-react";
import { useSettingsContext } from "../../../../web-contexts/SettingsContext";
import { DerivedExampleTextDetailListedHeadwordsView } from "../../api-fetchers/DerivedExampleTextDetailListedHeadwordsView";

export const DerivedExampleTextDisplay = ({
  data,
  interactionData,
}: {
  data: DerivedExampleTextType;
  interactionData: DerivedExampleTextInteractionData;
}) => {
  return (
    <div className="flex flex-row gap-4 justify-between">
      <div className="max-w-[70%]">
        <DerivedExampleTextDisplayMainContent
          text={data.text}
          source={data.source}
        />
      </div>
      <div className="flex-grow-0 flex-shrink">
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
      className="max-w-[50%] min-w-36 bg-[color:--background-secondary]"
      aria-label="derived-example-text-display-side-bar"
    >
      <div className="flex flex-col justify-center items-center">
        {imageUrl !== undefined && (
          /* attempts to be max size, but stops if that would require more then
             200% increase in size */
          <img
            className="w-full max-w-full max-h-[150%] aspect-auto object-contain"
            src={imageUrl}
          ></img>
        )}
        <div>
          <DerivedExampleTextDetailListedHeadwordsView
            sourceTextPk={sourceTextPk}
            pageNum={interactionData.headwordSearchPanelPageNum}
            onlyUnknown={interactionData.headwordSearchPanelOnlyUnknownSet}
          />
        </div>
      </div>
    </aside>
  );
};

const DerivedExampleTextDisplayMainContent = ({
  text,
  source,
}: {
  text: string;
  source: string;
}) => {
  const { fontSizeSettings } = useSettingsContext();

  return (
    <section aria-label="derived-example-text-display-main-content">
      <h2 className="flex flex-row gap-2 items-center text-[200%] pb-8">
        <Sparkles size={fontSizeSettings.relativeFontSize * 32} />
        {source}
      </h2>
      <div className="whitespace-pre-line">{text}</div>
    </section>
  );
};
