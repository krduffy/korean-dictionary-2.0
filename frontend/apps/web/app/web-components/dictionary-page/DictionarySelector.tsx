import { PopupBox } from "../misc/PopupBox";
import { useRef, useState } from "react";
import {
  SearchConfigSetters,
  SearchConfig,
  SearchConfigDictionary,
  KoreanSearchConfig,
  AllowedKoreanSearchType,
} from "@repo/shared/types/panelAndViewTypes";
export const DictionarySelector = ({
  searchConfig,
  searchConfigSetters,
}: {
  searchConfig: SearchConfig;
  searchConfigSetters: SearchConfigSetters;
}) => {
  return (
    <button
      className="px-4 py-2 
    bg-blue-500 
    hover:bg-blue-600 
    active:bg-blue-700
    text-white 
    rounded-lg
    font-medium
    shadow-sm
    hover:shadow-md
    active:shadow-sm
    transition-all 
    duration-200
    flex items-center gap-2"
    >
      <span onClick={() => searchConfigSetters.switchDictionary()}>
        {searchConfig.dictionary === "korean" ? "한" : "漢"}
      </span>
      <SearchConfigDropdownMenuToggler
        searchConfig={searchConfig}
        searchConfigSetters={searchConfigSetters}
      />
    </button>
  );
};

const SearchConfigDropdownMenuToggler = ({
  searchConfig,
  searchConfigSetters,
}: {
  searchConfig: SearchConfig;
  searchConfigSetters: SearchConfigSetters;
}) => {
  const arrowRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
      <span ref={arrowRef} onClick={() => setShowDropdown(!showDropdown)}>
        {showDropdown ? "▲" : "▼"}
      </span>
      <PopupBox targetElement={arrowRef.current} isVisible={showDropdown}>
        {searchConfig.dictionary === "korean" ? (
          <KoreanSearchConfigDropdownMenu
            searchConfig={searchConfig.config}
            searchConfigSetters={searchConfigSetters}
          />
        ) : (
          <div>hanjajaaaaa</div>
        )}
      </PopupBox>
    </>
  );
};

const KoreanSearchConfigDropdownMenu = ({
  searchConfig,
  searchConfigSetters,
}: {
  searchConfig: KoreanSearchConfig;
  searchConfigSetters: SearchConfigSetters;
}) => {
  return (
    <div>
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
    <form>
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
        뜻풀이
      </label>
    </form>
  );
};
