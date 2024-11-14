import { UpdateKoreanSearchConfigArgs } from "@repo/shared/hooks/useSearchBarArea";
import {
  AllowedKoreanSearchType,
  KoreanSearchConfig,
} from "@repo/shared/types/panelAndViewTypes";
import { SearchConfigLabelAndSettingArea } from "./SearchConfigLabelAndSettingArea";

export const KoreanSearchConfigSettingsMenu = ({
  config,
  updateKoreanSearchConfig,
}: {
  config: KoreanSearchConfig;
  updateKoreanSearchConfig: (args: UpdateKoreanSearchConfigArgs) => void;
}) => {
  return (
    <KoreanSwitchSearchTypeConfigurer
      searchType={config.search_type}
      setSearchType={(st: AllowedKoreanSearchType) =>
        updateKoreanSearchConfig({
          field: "search_type",
          value: st,
        })
      }
    />
  );
};

const KoreanSwitchSearchTypeConfigurer = ({
  searchType,
  setSearchType,
}: {
  searchType: AllowedKoreanSearchType;
  setSearchType: (newType: AllowedKoreanSearchType) => void;
}) => {
  const settingArea = (
    <form className="text-right">
      <div className="mb-2">
        <label>
          <input
            type="radio"
            className="mr-1"
            name="search_type"
            checked={searchType === "word_exact"}
            onChange={() => {
              setSearchType("word_exact");
            }}
          />
          단어 맞춤
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            className="mr-1"
            name="search_type"
            checked={searchType === "definition_contains"}
            onChange={() => {
              setSearchType("definition_contains");
            }}
          />
          뜻풀이 포함
        </label>
      </div>
    </form>
  );

  return (
    <SearchConfigLabelAndSettingArea
      label={"검색형"}
      settingArea={settingArea}
    />
  );
};
