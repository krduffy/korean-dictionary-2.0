import { UpdateKoreanSearchConfigArgs } from "@repo/shared/hooks/useSearchBarArea";
import { SearchConfigLabelAndSettingArea } from "./SearchConfigLabelAndSettingArea";
import {
  AllowedKoreanSearchType,
  KoreanSearchConfig,
} from "@repo/shared/types/views/searchConfigTypes";
import { useLoginStatusContext } from "@repo/shared/contexts/LoginStatusContextProvider";

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
  const { isStaff } = useLoginStatusContext();

  const searchTypeOptions = [
    {
      label: "단어 맞춤",
      optionSearchType: "word_exact",
    },
    {
      label: "뜻풀이 포함",
      optionSearchType: "definition_contains",
    },
    isStaff &&
      ({
        label: "리젝스",
        optionSearchType: "word_regex",
      } as const),
  ] as const;

  const settingArea = (
    <form className="text-right flex flex-col gap-2">
      {searchTypeOptions.map(
        (config) =>
          config && (
            <SearchTypeOptionWithCheckbox
              key={config.label}
              label={config.label}
              searchType={searchType}
              optionSearchType={config.optionSearchType}
              setSearchType={setSearchType}
            />
          )
      )}
    </form>
  );

  return (
    <SearchConfigLabelAndSettingArea
      label={"검색형"}
      settingArea={settingArea}
    />
  );
};

const SearchTypeOptionWithCheckbox = ({
  label,
  searchType,
  optionSearchType,
  setSearchType,
}: {
  label: string;
  searchType: AllowedKoreanSearchType;
  optionSearchType: AllowedKoreanSearchType;
  setSearchType: (newType: AllowedKoreanSearchType) => void;
}) => {
  return (
    <label>
      <input
        type="radio"
        className="mr-1"
        name="search_type"
        checked={searchType === optionSearchType}
        onChange={() => {
          setSearchType(optionSearchType);
        }}
      />
      {label}
    </label>
  );
};
