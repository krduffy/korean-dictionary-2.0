/* puts every single eojeol into a separate span */

import "./eojeol-highlight.css";
import { useDerivedExampleTextContext } from "./DerivedExampleTextContext";
import { PanelSpecificDispatcher } from "../../../../pages/dictionary-page/PanelSpecificDispatcher";
import { memo, ReactNode } from "react";
import { ClickableLinkStyler } from "../../../../text-formatters/SpanStylers";

export const DerivedExampleTextSourceText = memo(
  ({ text }: { text: string }) => {
    const { sourceTextPk, sourceTextRef } = useDerivedExampleTextContext();

    let eojeolNum = 0;

    const tokens = text
      .split(/([^\s\r\n]+|[\s\r\n]+)/)
      .filter((substr) => substr.length > 0)
      .map((substr, id) =>
        substr.match(/[\s\r\n]+/) ? (
          <span key={id}>{substr}</span>
        ) : (
          <EojeolSpan
            key={id}
            sourceTextPk={sourceTextPk}
            eojeolNum={eojeolNum++}
          >
            {substr}
          </EojeolSpan>
        )
      );

    return (
      <div ref={sourceTextRef} className="whitespace-pre-line">
        {tokens}
      </div>
    );
  }
);

const EojeolSpan = ({
  children,
  sourceTextPk,
  eojeolNum,
}: {
  children: ReactNode;
  sourceTextPk: number;
  eojeolNum: number;
}) => {
  return (
    <PanelSpecificDispatcher
      panelStateAction={{
        type: "push_derived_example_text_eojeol_num_lemmas",
        sourceTextPk: sourceTextPk,
        eojeolNum: eojeolNum,
      }}
    >
      <ClickableLinkStyler>
        <span className={`eojeol-num-${eojeolNum}`}>{children}</span>
      </ClickableLinkStyler>
    </PanelSpecificDispatcher>
  );
};
