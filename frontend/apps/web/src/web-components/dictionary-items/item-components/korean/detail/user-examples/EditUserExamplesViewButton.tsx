import { PanelSpecificDispatcher } from "../../../../../pages/dictionary-page/PanelSpecificDispatcher";
import { Button } from "../../../../../ui/Button";

export const EditUserExamplesViewButton = ({
  headword,
  targetCode,
}: {
  headword: string;
  targetCode: number;
}) => {
  return (
    <PanelSpecificDispatcher
      panelStateAction={{
        type: "push_korean_user_example_edit",
        headword: headword,
        target_code: targetCode,
      }}
    >
      <Button type="button">용례 수정</Button>
    </PanelSpecificDispatcher>
  );
};
