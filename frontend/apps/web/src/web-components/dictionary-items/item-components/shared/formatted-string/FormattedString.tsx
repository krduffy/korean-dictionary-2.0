import { useStringWithNLP } from "@repo/shared/hooks/useStringWithNLP";
import { PanelSpecificDispatcher } from "../../../../pages/dictionary-page/PanelSpecificDispatcher";
import { Fragment, memo } from "react";
import { StringWithHanja } from "./StringWithHanja";
import { ClickableLinkStyler } from "../../../../text-formatters/SpanStylers";

import { NLPToken } from "@repo/shared/types/koreanLangTypes";

/* Embedding hanja adds StringWithHanja where applicable */
/* Embedding examples turns strings surrounded by curly braces into underlined text and removes the curly braces. */

export const StringWithNLP = memo(({ string }: { string: string }) => {
  return (
    <BaseFormattedString
      string={string}
      embedNLP={true}
      embedHanja={false}
      embedExamples={false}
    />
  );
});

export const StringWithNLPAndHanja = memo(({ string }: { string: string }) => {
  return (
    <BaseFormattedString
      string={string}
      embedHanja={true}
      embedNLP={true}
      embedExamples={false}
    />
  );
});

export const ExampleStringWithNLPAndHanja = memo(
  ({ string }: { string: string }) => {
    return (
      <BaseFormattedString
        string={string}
        embedNLP={true}
        embedHanja={true}
        embedExamples={true}
      />
    );
  }
);

export const ExampleStringWithHanja = memo(({ string }: { string: string }) => {
  return (
    <BaseFormattedString
      string={string}
      embedNLP={false}
      embedHanja={true}
      embedExamples={true}
    />
  );
});

const BaseFormattedString = ({
  string,
  embedNLP,
  embedHanja,
  embedExamples,
}: {
  string: string;
  embedNLP: boolean;
  embedHanja: boolean;
  embedExamples: boolean;
}) => {
  const { sentencesWithTokens } = useStringWithNLP({
    string: string,
    embedExamples: embedExamples,
  });

  return (
    <span>
      {sentencesWithTokens.map((pair, sentenceId, sentenceArray) => {
        const sentence: string = pair[0];
        const tokens: NLPToken[] = pair[1];

        let eojeolIndex = 0;

        return (
          <Fragment key={sentenceId}>
            {tokens?.map((nlpToken, nlpTokenId) => {
              if (nlpToken.token.includes(" ")) eojeolIndex++;

              return (
                <PrintedToken
                  key={nlpTokenId}
                  nlpToken={nlpToken}
                  sentence={sentence}
                  index={eojeolIndex}
                  embedNLP={embedNLP}
                  embedHanja={embedHanja}
                />
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

const PrintedToken = ({
  nlpToken,
  sentence,
  index,
  embedNLP,
  embedHanja,
}: {
  nlpToken: NLPToken;
  sentence: string;
  index: number;
  embedNLP: boolean;
  embedHanja: boolean;
}) => {
  if (nlpToken.type === "hangul") {
    return embedNLP ? (
      <WordWithNLP word={nlpToken.token} sentence={sentence} index={index} />
    ) : (
      <span>{nlpToken.token}</span>
    );
  }

  if (nlpToken.type === "other") {
    return embedHanja ? (
      <StringWithHanja string={nlpToken.token} />
    ) : (
      <span>{nlpToken.token}</span>
    );
  }

  if (nlpToken.type === "example") {
    return <span className="underline">{nlpToken.token}</span>;
  }
};

const WordWithNLP = ({
  word,
  sentence,
  index,
}: {
  word: string;
  sentence: string;
  index: number;
}) => {
  return (
    <span>
      <PanelSpecificDispatcher
        panelStateAction={{
          type: "push_find_lemma",
          word: word,
          sentence: sentence,
          index: index,
        }}
      >
        <ClickableLinkStyler>{word}</ClickableLinkStyler>
      </PanelSpecificDispatcher>
    </span>
  );
};
