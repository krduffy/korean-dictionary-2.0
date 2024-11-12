import { UpdateHanjaSearchConfigArgs } from "@repo/shared/hooks/useSearchBarArea";
import { HanjaSearchConfig } from "@repo/shared/types/panelAndViewTypes";
import {
  SearchConfigLabelAndSettingArea,
  SearchConfigLabelAndSettingAreaDivider,
} from "./SearchConfigLabelAndSettingArea";
import { useHanjaConfigSettingsMenu } from "../../../web-hooks/useHanjaConfigSettingsMenu";

type HanjaSearchConfigSettingsMenuArgs = {
  config: HanjaSearchConfig;
  updateHanjaSearchConfig: (args: UpdateHanjaSearchConfigArgs) => void;
  deleteSearchConfigItemByKey: (keyToDelete: string) => void;
};

export const HanjaSearchConfigSettingsMenu = ({
  config,
  updateHanjaSearchConfig,
  deleteSearchConfigItemByKey,
}: HanjaSearchConfigSettingsMenuArgs) => {
  const {
    radicalArea,
    decompositionArea,
    strokesArea,
    gradeLevelArea,
    examLevelArea,
  } = useHanjaConfigSettingsMenu({
    config,
    updateHanjaSearchConfig,
    deleteSearchConfigItemByKey,
  });

  return (
    <div className="flex flex-col gap-4">
      <SearchConfigLabelAndSettingArea
        label={"부수"}
        settingArea={radicalArea}
      />
      <SearchConfigLabelAndSettingAreaDivider />

      <SearchConfigLabelAndSettingArea
        label={"모양자 분해"}
        settingArea={decompositionArea}
      />
      <SearchConfigLabelAndSettingAreaDivider />

      <SearchConfigLabelAndSettingArea
        label={"획수"}
        settingArea={strokesArea}
      />
      <SearchConfigLabelAndSettingAreaDivider />

      <SearchConfigLabelAndSettingArea
        label={"학교용"}
        settingArea={gradeLevelArea}
      />
      <SearchConfigLabelAndSettingAreaDivider />

      <SearchConfigLabelAndSettingArea
        label={"급수"}
        settingArea={examLevelArea}
      />
    </div>
  );
};
