import { UserExamplesType } from "@repo/shared/types/views/dictionary-items/koreanDictionaryItems";
import { KoreanDetailUserExampleDropdownState } from "@repo/shared/types/views/interactionDataTypes";
import { TopLevelHideableDropdownNoTruncation } from "../../../shared/ReusedFormatters";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { UserSentencesAndDerivedLemmasArea } from "./UserSentencesAndDerivedLemmasArea";
import { UserVideoExamplesArea } from "./UserVideosArea";
import { isArrayOfAtLeastLengthOne } from "@repo/shared/types/guardUtils";

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
      {((Array.isArray(userExamples.user_example_sentences) &&
        userExamples.user_example_sentences.length > 0) ||
        (Array.isArray(userExamples.derived_example_lemmas) &&
          userExamples.derived_example_lemmas.length > 0)) && (
        <UserSentencesAndDerivedLemmasArea
          droppedDown={userExampleDropdowns.sentencesDroppedDown}
          allDerivedExampleLemmasData={userExamples.derived_example_lemmas}
          allUserExampleSentencesData={userExamples.user_example_sentences}
        />
      )}
      {Array.isArray(userExamples.user_video_examples) &&
        userExamples.user_video_examples.length > 0 && (
          <UserVideoExamplesArea
            droppedDown={userExampleDropdowns.videosDroppedDown}
            allUserVideoExamplesData={userExamples.user_video_examples}
          />
        )}
    </TopLevelHideableDropdownNoTruncation>
  );
};
