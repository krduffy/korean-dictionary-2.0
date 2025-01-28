import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { useDerivedExampleTextContext } from "./DerivedExampleTextContext";
import { useEffect } from "react";

export const useDerivedExampleTextDisplayMainContent = ({
  highlightEojeolNumOnLoad,
}: {
  highlightEojeolNumOnLoad: number | null;
}) => {
  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();
  const { highlightEojeol } = useDerivedExampleTextContext();

  /* give time for the text to load so the span with class eojeol num
     is in the dom */
  const HIGHLIGHT_DELAY = 500;

  useEffect(() => {
    if (highlightEojeolNumOnLoad !== null) {
      setTimeout(() => {
        highlightEojeol(highlightEojeolNumOnLoad);
        panelDispatchStateChangeSelf({
          type: "update_derived_example_text_interaction_data",
          key: "highlightEojeolNumOnLoad",
          newValue: null,
        });
      }, HIGHLIGHT_DELAY);
    }
  }, [highlightEojeolNumOnLoad]);
};
