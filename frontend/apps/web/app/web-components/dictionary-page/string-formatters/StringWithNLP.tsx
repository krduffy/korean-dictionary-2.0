import { useStringWithNLP } from "app/web-hooks/useStringWithNLP";
import { useHoverState } from "app/web-hooks/useWordWithNLP";
import { PanelSpecificDispatcher } from "./PanelSpecificDispatcher";
import { useRef, Fragment } from "react";

export const StringWithNLP = ({ string }: { string: string }) => {
  const { sentencesWithWords } = useStringWithNLP({ string: string });

  return (
    <span>
      {sentencesWithWords.map((pair, sentenceId) => {
        /* */
        const sentence: string = pair[0];
        const words: string[] = pair[1];

        return (
          <Fragment key={sentenceId}>
            {words?.map((word, wordId) => {
              return (
                <Fragment key={wordId}>
                  <WordWithNLP word={word} sentence={sentence} />
                </Fragment>
              );
            })}

            <span>.</span>
          </Fragment>
        );
      })}
    </span>
  );
};

const WordWithNLP = ({
  word,
  sentence,
}: {
  word: string;
  sentence: string;
}) => {
  const { hovering, handleMouseEnter, handleMouseLeave } = useHoverState();
  const spanRef = useRef(null);

  return (
    <span
      ref={spanRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <PanelSpecificDispatcher
        panelStateAction={{
          type: "push_find_lemma",
          word: word,
          sentence: sentence,
        }}
      >
        <span>{word}</span>
      </PanelSpecificDispatcher>
    </span>
  );
};
