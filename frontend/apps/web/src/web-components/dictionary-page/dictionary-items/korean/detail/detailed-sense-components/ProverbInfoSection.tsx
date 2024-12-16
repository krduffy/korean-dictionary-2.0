import { PanelSpecificDispatcher } from "../../../../panel/PanelSpecificDispatcher";
import { StringWithNLPAndHanja } from "../../../../../other/string-formatters/StringWithNLP";
import { ProverbType } from "@repo/shared/types/views/dictionary-items/senseDictionaryItems";
import {
  AccentedTextWithBorder,
  ClickableLinkStyler,
} from "../../../../../other/string-formatters/SpanStylers";

export const ProverbInfoSection = ({
  proverbs,
}: {
  proverbs: ProverbType[];
}) => {
  return (
    <div className="flex flex-col gap-4">
      {proverbs.map((proverb, id) => (
        <div key={id} className="">
          <SenseProverb proverb={proverb} />
        </div>
      ))}
    </div>
  );
};

const SenseProverb = ({ proverb }: { proverb: ProverbType }) => {
  /* In the original data, <sense_no></sense_no> is around the same meaning
     proverb tags, letting those link to the senses themselves.
     I delete all of these to clean the strings of unused html tags.
     It may at some point be worth coming back and refactoring the database models to do away
     with "additional_info" entirely but it is not worth the time atm
     Here, i just extract that part from the proverb string if it exists and render it
     a bit differently. They do not link but it is not a big deal */

  const proverbDefinitionSplitAlongSameMeaningItems = proverb.definition.split(
    `<동의 ${proverb.type}>`
  );

  const actualProverbDefinition: string | undefined =
    proverbDefinitionSplitAlongSameMeaningItems[0];

  const linkedProverbIfExists = proverb.link_target_code ? (
    <PanelSpecificDispatcher
      panelStateAction={{
        type: "push_korean_detail",
        target_code: proverb.link_target_code,
      }}
    >
      <ClickableLinkStyler>{proverb.word}</ClickableLinkStyler>
    </PanelSpecificDispatcher>
  ) : (
    <span>{proverb.word}</span>
  );

  return (
    <>
      <div
        className="pb-2 flex flex-row gap-2 items-center"
        style={{
          fontSize: "110%",
        }}
      >
        <AccentedTextWithBorder accentNumber={3}>
          {proverb.type}
        </AccentedTextWithBorder>
        {linkedProverbIfExists}
      </div>
      <div>
        {actualProverbDefinition === undefined ? (
          <div className="text-[color:--error-color]">
            뜻풀이 로드 과정 중간에 오류가 발생했습니다.
          </div>
        ) : (
          <StringWithNLPAndHanja string={actualProverbDefinition} />
        )}
      </div>
      {proverbDefinitionSplitAlongSameMeaningItems[1] && (
        <div className="pt-1">
          <SameMeaningWords
            type={proverb.type}
            itemString={proverbDefinitionSplitAlongSameMeaningItems[1]}
          />
        </div>
      )}
    </>
  );
};

const SameMeaningWords = ({
  type,
  itemString,
}: {
  type: string;
  itemString: string;
}) => {
  const wordIterator = itemString.matchAll(new RegExp(/‘.+?’/g));
  const words = Array.from(wordIterator, (match) => match[0]).map((word) =>
    word.substring(1, word.length - 1)
  );

  const koreanSearchDispatchers = words.map((word) => (
    <PanelSpecificDispatcher
      panelStateAction={{
        type: "push_korean_search",
        searchConfig: {
          search_term: word,
          search_type: "word_exact",
          page: 1,
        },
      }}
    >
      <ClickableLinkStyler>{word}</ClickableLinkStyler>
    </PanelSpecificDispatcher>
  ));

  return (
    <div className="flex flex-row gap-2">
      <div className="underline decoration-dotted decoration-[color:--accent-3]">
        동의 {type}:
      </div>
      <div>
        {koreanSearchDispatchers.map((dispatcherSpan, id, arr) => (
          <span key={id}>
            {dispatcherSpan}
            {`${id !== arr.length - 1 ? " • " : ""}`}
          </span>
        ))}
      </div>
    </div>
  );
};
