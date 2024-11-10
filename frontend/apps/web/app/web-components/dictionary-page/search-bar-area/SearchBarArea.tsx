import {
  SearchConfig,
  PanelStateAction,
} from "@repo/shared/types/panelAndViewTypes";
import { DictionarySelector } from "./DictionarySelector";

import { useSearchBarArea } from "@repo/shared/hooks/useSearchBarArea";
import { SearchIcon } from "lucide-react";

interface SearchBarAreaArgs {
  searchConfig: SearchConfig;
  dispatch: React.Dispatch<PanelStateAction>;
}

export const SearchBarArea = ({
  searchConfig,
  dispatch,
}: SearchBarAreaArgs) => {
  const {
    submitSearch,
    updateKoreanSearchConfig,
    updateHanjaSearchConfig,
    updateSearchTerm,
    switchDictionary,
  } = useSearchBarArea({ searchConfig: searchConfig, dispatch: dispatch });

  return (
    <div className="flex flex-row h-full w-full">
      <div className="w-[10%]">
        <DictionarySelector
          searchConfig={searchConfig}
          updateKoreanSearchConfig={updateKoreanSearchConfig}
          updateHanjaSearchConfig={updateHanjaSearchConfig}
          switchDictionary={switchDictionary}
        />
      </div>
      <div className="w-[90%]">
        <SearchBar
          searchTerm={searchConfig.config.search_term}
          updateSearchTerm={updateSearchTerm}
          submitSearch={submitSearch}
        />
      </div>
      {/*<SubmitSearchButton submitSearch={submitSearch} />*/}
    </div>
  );
};

const SearchBar = ({
  searchTerm,
  updateSearchTerm,
  submitSearch,
}: {
  searchTerm: string;
  updateSearchTerm: (searchTerm: string) => void;
  submitSearch: (e: React.FormEvent) => void;
}) => {
  return (
    <form className="relative h-full w-full">
      {/* padding to left of search text is 10 (2.5rem); the width of the icon is 24px (6; 1.5rem)
          so this has a padding to the left of 2 (0.5rem) */}
      <button
        className="h-full absolute top-0 left-0 pl-2 hover:text-[color:--"
        onClick={submitSearch}
      >
        <SearchIcon />
      </button>
      <input
        type="search"
        placeholder="검색어를 입력해주세요."
        value={searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          updateSearchTerm(e.target.value)
        }
        className="h-full w-full pl-10 px-4 py-2 
      bg-white/10 
      border border-gray-200/20 
      rounded-full
      outline-none 
      focus:ring-2 focus:[color:--focus-blue]
      hover:bg-white/20
      transition-all duration-200
      "
      />
    </form>
  );
};

const SubmitSearchButton = ({
  submitSearch,
}: {
  submitSearch: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <button
      type="submit"
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
      onClick={submitSearch}
    >
      검색
    </button>
  );
};
