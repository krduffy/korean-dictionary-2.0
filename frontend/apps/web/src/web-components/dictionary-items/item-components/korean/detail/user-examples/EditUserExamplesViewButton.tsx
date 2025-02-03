import { PanelSpecificDispatcher } from "../../../../../pages/dictionary-page/PanelSpecificDispatcher";
import { Button } from "../../../../../ui/Button";

export const EditUserExamplesViewButton = ({
  targetCode,
}: {
  targetCode: number;
}) => {
  return (
    <PanelSpecificDispatcher
      panelStateAction={{
        type: "push_korean_user_example_edit",
        target_code: targetCode,
      }}
    >
      <Button type="button">용례 수정</Button>
    </PanelSpecificDispatcher>
  );
};
