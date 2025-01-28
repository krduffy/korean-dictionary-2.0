/* puts every single eojeol into a separate span */

import "./eojeol-highlight.css";
import { useDerivedExampleTextContext } from "./DerivedExampleTextContext";
import { PanelSpecificDispatcher } from "../../../../pages/dictionary-page/PanelSpecificDispatcher";

export const DerivedExampleTextSourceText = ({ text }: { text: string }) => {
  const { sourceTextPk, sourceTextRef } = useDerivedExampleTextContext();

  let eojeolNum = 0;

  const tokens = text
    .split(/([^\s\r\n]+|[\s\r\n]+)/)
    .filter((substr) => substr.length > 0)
    .map((substr, id) => {
      if (!substr.match(/[\s\r\n]+/)) {
        const thisEojeolNum = eojeolNum++;

        return (
          <PanelSpecificDispatcher
            panelStateAction={{
              type: "push_derived_example_text_eojeol_num_lemmas",
              sourceTextPk: sourceTextPk,
              eojeolNum: thisEojeolNum,
            }}
            key={id}
          >
            <span className={`eojeol-num-${thisEojeolNum}`}>{substr}</span>
          </PanelSpecificDispatcher>
        );
      } else return <span key={id}>{substr}</span>;
    });

  return (
    <div ref={sourceTextRef} className="whitespace-pre-line">
      {tokens}
    </div>
  );
};
