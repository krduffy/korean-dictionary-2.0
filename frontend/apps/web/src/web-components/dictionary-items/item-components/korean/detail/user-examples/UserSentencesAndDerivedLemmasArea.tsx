import { UserExampleSentenceType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { BasicNestedHideableDropdownNoTruncation } from "../../../shared/ReusedFormatters";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { ListedUserExampleSentences } from "./ListedUserExampleSentences";

export const UserSentencesArea = ({
  droppedDown,
  allUserExampleSentencesData,
}: {
  droppedDown: boolean;
  allUserExampleSentencesData: UserExampleSentenceType[] | null;
}) => {
  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  const onDropdownStateToggle = (newIsDroppedDown: boolean) => {
    panelDispatchStateChangeSelf({
      type: "update_korean_detail_user_example_interaction_data",
      key: "sentencesDroppedDown",
      newValue: newIsDroppedDown,
    });
  };

  const hasUserExampleSentences =
    allUserExampleSentencesData && allUserExampleSentencesData.length > 0;

  return (
    <BasicNestedHideableDropdownNoTruncation
      title="예문"
      droppedDown={droppedDown}
      onDropdownStateToggle={onDropdownStateToggle}
    >
      {hasUserExampleSentences && (
        <ListedUserExampleSentences
          allUserExampleSentencesData={allUserExampleSentencesData}
        ></ListedUserExampleSentences>
      )}
    </BasicNestedHideableDropdownNoTruncation>
  );
};
