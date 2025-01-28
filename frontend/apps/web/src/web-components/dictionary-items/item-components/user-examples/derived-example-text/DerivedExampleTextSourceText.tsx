/* puts every single eojeol into a separate span */

import "./eojeol-highlight.css";
import { useDerivedExampleTextContext } from "./DerivedExampleTextContext";

export const DerivedExampleTextSourceText = ({ text }: { text: string }) => {
  const { sourceTextRef } = useDerivedExampleTextContext();

  let eojeol_num = 0;

  const tokens = text
    .split(/([^\s\r\n]+|[\s\r\n]+)/)
    .filter((substr) => substr.length > 0)
    .map((substr, id) =>
      substr.match(/[\s\r\n]+/) ? (
        <span key={id}>{substr}</span>
      ) : (
        <span key={id} className={`eojeol-num-${eojeol_num++}`}>
          {substr}
        </span>
      )
    );

  return (
    <div ref={sourceTextRef} className="whitespace-pre-line">
      {tokens}
    </div>
  );
};
