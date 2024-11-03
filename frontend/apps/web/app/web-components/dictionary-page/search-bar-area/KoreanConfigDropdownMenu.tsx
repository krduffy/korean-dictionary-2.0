import {
  AllowedKoreanSearchType,
  KoreanSearchConfig,
  SearchConfigSetters,
} from "@repo/shared/types/panelAndViewTypes";

export const KoreanSearchConfigDropdownMenu = ({
  searchConfig,
  searchConfigSetters,
}: {
  searchConfig: KoreanSearchConfig;
  searchConfigSetters: SearchConfigSetters;
}) => {
  return (
    <div className="bg-black pb-10 px-10">
      <div>한국어 검색 변수 설정</div>
      <KoreanSwitchSearchTypeConfigurer
        searchType={searchConfig.search_type}
        setSearchType={searchConfigSetters.setKoreanSearchType}
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
