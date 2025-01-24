import { DerivedExampleLemmaType } from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { ExampleStringWithNLPAndHanja } from "../../../shared/formatted-string/FormattedString";
import { Source } from "../../../../../text-formatters/SpanStylers";
import { Sparkles, TextSearch } from "lucide-react";
import { useSettingsContext } from "../../../../../../web-contexts/SettingsContext";

export const DerivedLemmaExamplesArea = ({
  allDerivedExampleLemmasData,
}: {
  allDerivedExampleLemmasData: DerivedExampleLemmaType[];
}) => {
  return (
    <ListedDerivedExampleLemmas
      allDerivedExampleLemmasData={allDerivedExampleLemmasData}
    />
  );
};

const ListedDerivedExampleLemmas = ({
  allDerivedExampleLemmasData,
}: {
  allDerivedExampleLemmasData: DerivedExampleLemmaType[];
}) => {
  return (
    <ul
      className="flex flex-col gap-4"
      aria-label="derived-example-lemmas-list"
    >
      {allDerivedExampleLemmasData.map((derivedExampleLemmaData, index) => (
        <li key={index}>
          <DerivedExampleLemma
            derivedExampleLemmaData={derivedExampleLemmaData}
          />
        </li>
      ))}
    </ul>
  );
};

const DerivedExampleLemma = ({
  derivedExampleLemmaData,
}: {
  derivedExampleLemmaData: DerivedExampleLemmaType;
}) => {
  return (
    <article className="mb-2 flex flex-row" aria-label="derived-example-lemma">
      <div className="flex flex-col gap-2">
        <DerivedExampleLemmaSourceTextPreviewArea
          sourceTextPreview={derivedExampleLemmaData.source_text_preview}
        />
        <DerivedExampleLemmaSourceFooter
          source={derivedExampleLemmaData.source}
        />
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
      {/* TODO make this a button that directs to a more detailed view of the
          entire text; will need to take in the rest of the pk etc from the
          DerivedExampleLemma and make a new view */}
      <div className="flex items-center justify-center">
        <TextSearch />
      </div>
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
          <Sparkles
            size={fontSizeSettings.relativeFontSize * 16}
            className="text-[color:--]"
          />
        </div>
        {source}
      </div>
    </Source>
  );
};
