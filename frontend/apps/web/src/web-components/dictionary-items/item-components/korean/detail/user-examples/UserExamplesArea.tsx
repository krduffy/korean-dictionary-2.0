import { UserExamplesType } from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { KoreanDetailUserExampleDropdownState } from "@repo/shared/types/views/interactionDataTypes";
import { TopLevelHideableDropdownNoTruncation } from "../../../shared/ReusedFormatters";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { UserSentencesAndDerivedLemmasArea } from "./UserSentencesAndDerivedLemmasArea";
import { UserVideoExamplesArea } from "./UserVideosArea";

export const UserExamplesArea = ({
  userExampleDropdowns,
  userExamples,
}: {
  userExampleDropdowns: KoreanDetailUserExampleDropdownState;
  userExamples: UserExamplesType;
}) => {
  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  const onDropdownStateToggle = (newIsDroppedDown: boolean) => {
    panelDispatchStateChangeSelf({
      type: "update_korean_detail_user_example_interaction_data",
      key: "userExamplesDroppedDown",
      newValue: newIsDroppedDown,
    });
  };

  return (
    <TopLevelHideableDropdownNoTruncation
      title="내가 추가한 용례"
      droppedDown={userExampleDropdowns.userExamplesDroppedDown}
      onDropdownStateToggle={onDropdownStateToggle}
    >
      {(userExamples.user_example_sentences ||
        userExamples.derived_example_lemmas) && (
        <UserSentencesAndDerivedLemmasArea
          droppedDown={userExampleDropdowns.sentencesDroppedDown}
          allDerivedExampleLemmasData={userExamples.derived_example_lemmas}
          allUserExampleSentencesData={userExamples.user_example_sentences}
        />
      )}
      {userExamples.user_video_examples && (
        <UserVideoExamplesArea
          droppedDown={userExampleDropdowns.videosDroppedDown}
          allUserVideoExamplesData={userExamples.user_video_examples}
        />
      )}
    </TopLevelHideableDropdownNoTruncation>
  );
};
