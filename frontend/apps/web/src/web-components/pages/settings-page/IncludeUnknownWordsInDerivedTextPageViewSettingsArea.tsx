import { SettingNameAndControls } from "./SettingNameAndControls";
import { SimpleCheckboxControl } from "./SimpleCheckboxControl";

export const IncludeUnknownWordsInDerivedTextPageViewSettingsArea = ({
  includeUnknownWordsInDerivedTextPageViewSettings,
}: {
  includeUnknownWordsInDerivedTextPageViewSettings: {
    demoDoInclude: boolean;
    setDemoDoInclude: (newValue: boolean) => void;
  };
}) => {
  return (
    <SettingNameAndControls
      settingName="문서 열람 시 모르는 단어 목록 여부"
      settingHelp="문서를 열람할 때 사전창 오른쪽에 모르는 단어 목록 여부"
      controls={
        <SimpleCheckboxControl
          value={includeUnknownWordsInDerivedTextPageViewSettings.demoDoInclude}
          setter={
            includeUnknownWordsInDerivedTextPageViewSettings.setDemoDoInclude
          }
        />
      }
    />
  );
};
