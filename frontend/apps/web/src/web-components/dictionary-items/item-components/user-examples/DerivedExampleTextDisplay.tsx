import { DerivedExampleTextType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { DerivedExampleTextInteractionData } from "@repo/shared/types/views/interactionDataTypes";

export const DerivedExampleTextDisplay = ({
  data,
  interactionData,
}: {
  data: DerivedExampleTextType;
  interactionData: DerivedExampleTextInteractionData;
}) => {
  return (
    <div>
      {data.text}
      {data.source}
    </div>
  );
};
