import { HeadwordDerivedExampleSearchResultType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { ExampleStringWithNLPAndHanja } from "../../shared/formatted-string/FormattedString";
import { Sparkles, TextSearch } from "lucide-react";
import { useSettingsContext } from "../../../../../web-contexts/SettingsContext";
import { Source } from "../../../../text-formatters/SpanStylers";
import { PanelSpecificDispatcher } from "../../../../pages/dictionary-page/PanelSpecificDispatcher";

export const HeadwordDerivedExampleSearchResult = ({
  result,
}: {
  result: HeadwordDerivedExampleSearchResultType;
}) => {
  return (
    <article
      className="mb-2 flex flex-row gap-4"
      aria-label="derived-example-lemma"
    >
      {result.image_url && (
        <div className="flex items-center justify-center">
          <img className="aspect-square min-w-16" src={result.image_url} />
        </div>
      )}
      {/* TODO make this a button that directs to a more detailed view of the
          entire text; will need to take in the rest of the pk etc from the
         HeadwordDerivedExampleSearchResultand make a new view */}
      <GoToDerivedExampleTextDetailViewButton
        sourceTextPk={result.source_text_pk}
      />
      <div className="flex flex-col gap-2">
        <DerivedExampleLemmaSourceTextPreviewArea
          sourceTextPreview={result.source_text_preview}
        />
        <DerivedExampleLemmaSourceFooter source={result.source} />
      </div>
    </article>
  );
};

const DerivedExampleLemmaSourceTextPreviewArea = ({
  sourceTextPreview,
}: {
  sourceTextPreview: string;
}) => {
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <ExampleStringWithNLPAndHanja string={sourceTextPreview} />
    </div>
  );
};

const DerivedExampleLemmaSourceFooter = ({ source }: { source: string }) => {
  const { fontSizeSettings } = useSettingsContext();

  return (
    <Source>
      <div className="flex flex-row">
        <span>출처: </span>
        <div className="flex items-center justify-center px-2">
          <Sparkles size={fontSizeSettings.relativeFontSize * 16} />
        </div>
        {source}
      </div>
    </Source>
  );
};

const GoToDerivedExampleTextDetailViewButton = ({
  sourceTextPk,
}: {
  sourceTextPk: number;
}) => {
  return (
    <button className="flex items-center justify-center">
      <PanelSpecificDispatcher
        panelStateAction={{
          type: "push_lemma_derived_text_detail",
          sourceTextPk: sourceTextPk,
        }}
      >
        <TextSearch />
      </PanelSpecificDispatcher>
    </button>
  );
};
