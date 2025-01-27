import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { DerivedExampleTextHeadwordFromTextType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import React from "react";

export const DerivedExampleTextHeadwordFromText = ({
  result,
}: {
  result: DerivedExampleTextHeadwordFromTextType;
}) => {
  const { whichPanelAmI } = usePanelFunctionsContext();

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const sourceTextContainer = document.querySelector(
      `.${whichPanelAmI}-derived-example-text-source-text`
    );

    if (!sourceTextContainer) return;

    const eojeolSpan = sourceTextContainer.querySelector(
      `.eojeol-num-${result.eojeol_number_in_source_text}`
    );

    if (!eojeolSpan) return;

    eojeolSpan.scrollIntoView({
      behavior: "smooth",
    });

    eojeolSpan.classList.add("animate-eojeol-highlight");
    setTimeout(
      () => eojeolSpan.classList.remove("animate-eojeol-highlight"),
      5000
    );
  };

  return (
    <div>
      {result.lemma}
      <button onClick={onClick}>GO TO LEMMA IN TEXT</button>
    </div>
  );
};
