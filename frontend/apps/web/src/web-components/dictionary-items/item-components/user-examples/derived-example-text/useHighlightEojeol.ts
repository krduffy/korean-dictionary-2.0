import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";

export const useHighlightEojeol = () => {
  const { whichPanelAmI } = usePanelFunctionsContext();

  const highlightEojeol = (eojeolNum: number) => {
    const sourceTextContainer = document.querySelector(
      `.${whichPanelAmI}-derived-example-text-source-text`
    );

    if (!sourceTextContainer) return;

    const eojeolSpan = sourceTextContainer.querySelector(
      `.eojeol-num-${eojeolNum}`
    );

    if (!eojeolSpan) return;

    eojeolSpan.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    eojeolSpan.classList.add("animate-eojeol-highlight");
    setTimeout(
      () => eojeolSpan.classList.remove("animate-eojeol-highlight"),
      5000
    );
  };

  return highlightEojeol;
};
