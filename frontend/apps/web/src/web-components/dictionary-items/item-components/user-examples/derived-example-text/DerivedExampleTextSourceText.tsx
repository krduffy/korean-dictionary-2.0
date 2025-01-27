/* puts every single eojeol into a separate span */

import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import "./eojeol-highlight.css";
import { useHighlightEojeol } from "./useHighlightEojeol";
import { useEffect } from "react";

export const DerivedExampleTextSourceText = ({
  text,
  highlightEojeolNumOnLoad,
}: {
  text: string;
  highlightEojeolNumOnLoad: number | null;
}) => {
  const { whichPanelAmI, panelDispatchStateChangeSelf } =
    usePanelFunctionsContext();
  const highlightEojeol = useHighlightEojeol();

  useEffect(() => {
    if (highlightEojeolNumOnLoad !== null) {
      highlightEojeol(highlightEojeolNumOnLoad);
      panelDispatchStateChangeSelf({
        type: "update_derived_example_text_interaction_data",
        key: "highlightEojeolNumOnLoad",
        newValue: null,
      });
    }
  }, [highlightEojeolNumOnLoad]);

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
    /* whichPanelAmI is added to avoid conflicts with the other panel since the 
       buttons in the side bar for seeing unknown words have to be able to 
       document.querySelector to find this div */
    <div
      className={`${whichPanelAmI}-derived-example-text-source-text whitespace-pre-line`}
    >
      {tokens}
    </div>
  );
};
