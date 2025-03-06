import { HeadwordDerivedExampleSearchResultType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { ExampleStringWithNLPAndHanja } from "../../shared/formatted-string/FormattedString";
import { Sparkles, TextSearch } from "lucide-react";
import { useSettingsContext } from "../../../../../web-contexts/SettingsContext";
import { Source } from "../../../../text-formatters/SpanStylers";
import { PanelSpecificDispatcher } from "../../../../pages/dictionary-page/PanelSpecificDispatcher";
import { memo } from "react";

export const HeadwordDerivedExampleSearchResult = memo(
  ({ result }: { result: HeadwordDerivedExampleSearchResultType }) => {
    return (
      <article
        className="mb-2 flex flex-row gap-4"
        aria-label="derived-example-lemma"
      >
        {result.image_url && (
          <div className="flex items-center justify-center">
            <img
              className="min-w-16 object-contain max-h-32"
              src={result.image_url}
            />
          </div>
        )}
        <GoToDerivedExampleTextDetailViewButton
          sourceTextPk={result.source_text_pk}
          eojeolNumberInSourceText={result.eojeol_number_in_source_text}
        />
        <div className="flex flex-col gap-2">
          <DerivedExampleLemmaSourceTextPreviewArea
            sourceTextPreview={result.source_text_preview}
          />
          <DerivedExampleLemmaSourceFooter source={result.source} />
        </div>
      </article>
    );
  }
);

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
  eojeolNumberInSourceText,
}: {
  sourceTextPk: number;
  eojeolNumberInSourceText: number;
}) => {
  return (
    <PanelSpecificDispatcher
      panelStateAction={{
        type: "push_lemma_derived_text_detail",
        sourceTextPk: sourceTextPk,
        highlightEojeolNumOnLoad: eojeolNumberInSourceText,
      }}
    >
      <button className="flex items-center justify-center">
        <TextSearch />
      </button>
    </PanelSpecificDispatcher>
  );
};
