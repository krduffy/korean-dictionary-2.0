import { UpdateKoreanSearchConfigArgs } from "@repo/shared/hooks/useSearchBarArea";
import {
  AllowedKoreanSearchType,
  KoreanSearchConfig,
} from "@repo/shared/types/panelAndViewTypes";

export const KoreanSearchConfigDropdownMenu = ({
  config,
  updateKoreanSearchConfig,
}: {
  config: KoreanSearchConfig;
  updateKoreanSearchConfig: (args: UpdateKoreanSearchConfigArgs) => void;
}) => {
  return (
    <div className="bg-black pb-10 px-10">
      <div>한국어 검색 변수 설정</div>
      <KoreanSwitchSearchTypeConfigurer
        searchType={config.search_type}
        setSearchType={(st: AllowedKoreanSearchType) =>
          updateKoreanSearchConfig({
            field: "search_type",
            value: st,
          })
        }
      />
    </div>
  );
};

const KoreanSwitchSearchTypeConfigurer = ({
  searchType,
  setSearchType,
}: {
  searchType: AllowedKoreanSearchType;
  setSearchType: (newType: AllowedKoreanSearchType) => void;
}) => {
  return (
    <>
      <span>검색형</span>
      <form className="flex items-center">
        <label>
          <input
            type="radio"
            name="search_type"
            checked={searchType === "word_exact"}
            onChange={() => {
              setSearchType("word_exact");
            }}
          />
          단어 맞춤
        </label>
        <label>
          <input
            type="radio"
            name="search_type"
            checked={searchType === "definition_contains"}
            onChange={() => {
              setSearchType("definition_contains");
            }}
          />
          뜻풀이 포함
        </label>
      </form>
    </>
  );
};
