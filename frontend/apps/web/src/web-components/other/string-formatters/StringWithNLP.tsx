import { useStringWithNLP } from "@repo/shared/hooks/useStringWithNLP";
import { PanelSpecificDispatcher } from "../../dictionary-page/panel/PanelSpecificDispatcher";
import { Fragment, memo } from "react";
import { StringWithHanja } from "./StringWithHanja";
import { ClickableLinkStyler } from "./SpanStylers";

import { NLPToken } from "@repo/shared/types/koreanLangTypes";

/* Embedding hanja adds StringWithHanja where applicable */
/* Embedding examples turns strings surrounded by curly braces into underlined text and removes the curly braces. */

export const StringWithNLP = memo(({ string }: { string: string }) => {
  return (
    <BaseStringWithNLP
      string={string}
      embedHanja={false}
      embedExamples={false}
    />
  );
});

export const StringWithNLPAndHanja = memo(({ string }: { string: string }) => {
  return (
    <BaseStringWithNLP
      string={string}
      embedHanja={true}
      embedExamples={false}
    />
  );
});

export const ExampleStringWithNLPAndHanja = memo(
  ({ string }: { string: string }) => {
    return (
      <BaseStringWithNLP
        string={string}
        embedHanja={true}
        embedExamples={true}
      />
    );
  }
);

const BaseStringWithNLP = ({
  string,
  embedHanja,
  embedExamples,
}: {
  string: string;
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

        return (
          <Fragment key={sentenceId}>
            {tokens?.map((nlpToken, nlpTokenId) => (
              <PrintedNLPToken
                key={nlpTokenId}
                nlpToken={nlpToken}
                sentence={sentence}
                embedHanja={embedHanja}
              />
            ))}
            {/* if not last sentence then add space */}
            {sentenceId != sentenceArray.length - 1 && " "}
          </Fragment>
        );
      })}
    </span>
  );
};

const PrintedNLPToken = ({
  nlpToken,
  sentence,
  embedHanja,
}: {
  nlpToken: NLPToken;
  sentence: string;
  embedHanja: boolean;
}) => {
  if (nlpToken.type === "hangul") {
    return <WordWithNLP word={nlpToken.token} sentence={sentence} />;
  } else if (nlpToken.type === "other" && embedHanja) {
    return <StringWithHanja string={nlpToken.token} />;
  } else if (nlpToken.type === "other") {
    return <span>{nlpToken.token}</span>;
  } else if (nlpToken.type === "example") {
    return <span className="underline">{nlpToken.token}</span>;
  }
};

const WordWithNLP = ({
  word,
  sentence,
}: {
  word: string;
  sentence: string;
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
        <ClickableLinkStyler>{word}</ClickableLinkStyler>
      </PanelSpecificDispatcher>
    </span>
  );
};
