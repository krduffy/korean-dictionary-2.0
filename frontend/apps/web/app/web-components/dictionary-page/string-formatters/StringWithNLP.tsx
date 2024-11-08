import { useStringWithNLP } from "app/web-hooks/useStringWithNLP";
import { PanelSpecificDispatcher } from "./PanelSpecificDispatcher";
import { Fragment } from "react";
import { StringWithHanja } from "./StringWithHanja";
import { ClickableLinkStyler } from "./ClickableLink";

/* Embedding hanja adds StringWithHanja where applicable */
/* Embedding examples turns strings surrounded by curly braces into underlined text and removes the curly braces. */

export const StringWithNLP = ({ string }: { string: string }) => {
  return (
    <BaseStringWithNLP
      string={string}
      embedHanja={false}
      embedExamples={false}
    />
  );
};

export const StringWithNLPAndHanja = ({ string }: { string: string }) => {
  return (
    <BaseStringWithNLP
      string={string}
      embedHanja={true}
      embedExamples={false}
    />
  );
};

export const ExampleStringWithNLPAndHanja = ({
  string,
}: {
  string: string;
}) => {
  return (
    <BaseStringWithNLP string={string} embedHanja={true} embedExamples={true} />
  );
};

const BaseStringWithNLP = ({
  string,
  embedHanja,
  embedExamples,
}: {
  string: string;
  embedHanja: boolean;
  embedExamples: boolean;
}) => {
  const { sentencesWithWords } = useStringWithNLP({
    string: string,
    embedExamples: embedExamples,
  });

  return (
    <span>
      {sentencesWithWords.map((pair, sentenceId, sentenceArray) => {
        const sentence: string = pair[0];
        const words: string[] = pair[1];

        return (
          <Fragment key={sentenceId}>
            {words?.map((word, wordId, wordArray) => {
              return (
                <Fragment key={wordId}>
                  {/* if word surrounded by curly braces and embedExamples true then regular span */}
                  {embedExamples && word.match(/{.*?}/) ? (
                    <span className="underline">
                      {word.substring(1, word.length - 1)}
                    </span>
                  ) : (
                    <WordWithNLP
                      word={word}
                      sentence={sentence}
                      embedHanja={embedHanja}
                    />
                  )}
                  {/* adding space only if not last word; if last word then add period */}
                  {wordId === wordArray.length - 1 ? "." : " "}
                </Fragment>
              );
            })}
            {/* if not last sentence then add space */}
            {sentenceId != sentenceArray.length - 1 && " "}
          </Fragment>
        );
      })}
    </span>
  );
};

const WordWithNLP = ({
  word,
  sentence,
  embedHanja,
}: {
  word: string;
  sentence: string;
  embedHanja: boolean;
}) => {
  return (
    <span>
      <PanelSpecificDispatcher
        panelStateAction={{
          type: "push_find_lemma",
          word: word,
          sentence: sentence,
        }}
      >
        <ClickableLinkStyler>
          {embedHanja ? <StringWithHanja string={word} /> : <span>{word}</span>}
        </ClickableLinkStyler>
      </PanelSpecificDispatcher>
    </span>
  );
};
