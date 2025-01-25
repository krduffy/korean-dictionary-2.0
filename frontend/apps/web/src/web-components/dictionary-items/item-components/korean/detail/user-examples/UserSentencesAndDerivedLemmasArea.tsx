import {
  DerivedExampleLemmaType,
  UserExampleSentenceType,
} from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { BasicNestedHideableDropdownNoTruncation } from "../../../shared/ReusedFormatters";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { UserExampleSentencesArea } from "./UserExampleSentencesArea";
import { DerivedLemmaExamplesArea } from "./DerivedLemmaExamplesArea";
import { LineBreakArea } from "../../../../../ui/LineBreakArea";

export const UserSentencesAndDerivedLemmasArea = ({
  droppedDown,
  allDerivedExampleLemmasData,
  allUserExampleSentencesData,
}: {
  droppedDown: boolean;
  allDerivedExampleLemmasData: DerivedExampleLemmaType[] | null;
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
  const hasDerivedLemmaExamples =
    allDerivedExampleLemmasData && allDerivedExampleLemmasData.length > 0;

  return (
    <BasicNestedHideableDropdownNoTruncation
      title="예문"
      droppedDown={droppedDown}
      onDropdownStateToggle={onDropdownStateToggle}
    >
      {hasUserExampleSentences && (
        <UserExampleSentencesArea
          allUserExampleSentencesData={allUserExampleSentencesData}
        />
      )}
      {hasUserExampleSentences && hasDerivedLemmaExamples && (
        <LineBreakArea marginSize={32} />
      )}
      {hasDerivedLemmaExamples && (
        <DerivedLemmaExamplesArea
          allDerivedExampleLemmasData={allDerivedExampleLemmasData}
        />
      )}
    </BasicNestedHideableDropdownNoTruncation>
  );
};
