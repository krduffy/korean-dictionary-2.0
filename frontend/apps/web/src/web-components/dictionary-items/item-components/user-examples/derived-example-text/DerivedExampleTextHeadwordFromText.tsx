import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { DerivedExampleTextHeadwordFromTextType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { useHighlightEojeol } from "./useHighlightEojeol";
import React from "react";

export const DerivedExampleTextHeadwordFromText = ({
  result,
}: {
  result: DerivedExampleTextHeadwordFromTextType;
}) => {
  const highlightEojeol = useHighlightEojeol();

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    highlightEojeol(result.eojeol_number_in_source_text);
  };

  return (
    <div>
      {result.lemma}
      <button onClick={onClick}>GO TO LEMMA IN TEXT</button>
    </div>
  );
};
