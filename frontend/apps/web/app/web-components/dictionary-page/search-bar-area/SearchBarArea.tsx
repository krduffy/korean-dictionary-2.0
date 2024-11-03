import {
  SearchConfigSetters,
  SearchConfig,
} from "@repo/shared/types/panelAndViewTypes";
import { DictionarySelector } from "./DictionarySelector";

interface SearchBarAreaArgs {
  searchConfig: SearchConfig;
  searchConfigSetters: SearchConfigSetters;
  submitSearch: (e: React.FormEvent) => void;
}

export const SearchBarArea = ({
  searchConfig,
  searchConfigSetters,
  submitSearch,
}: SearchBarAreaArgs) => {
  return (
    <div className="flex flex-row h-full w-full">
      <div className="w-[10%]">
        <DictionarySelector
          searchConfig={searchConfig}
          searchConfigSetters={searchConfigSetters}
        />
      </div>
      <div className="w-[90%]">
        <SearchBar
          searchTerm={searchConfig.config.search_term}
          setSearchTerm={searchConfigSetters.setSearchTerm}
          submitSearch={submitSearch}
        />
      </div>
      {/*<SubmitSearchButton submitSearch={submitSearch} />*/}
    </div>
  );
};

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  submitSearch,
}: {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  submitSearch: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <form className="relative h-full w-full">
      <button
        className="w-10 top-1/2 -translate-y-1/2 absolute rotate-45 text-2xl focus:color-[color:--"
        onClick={submitSearch}
      >
        ⚲
      </button>
      <input
        type="search"
        placeholder="검색어를 입력해주세요."
        value={searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(e.target.value)
        }
        className="w-full pl-10 px-4 py-2 
      bg-white/10 
      border border-gray-200/20 
      rounded-full
      outline-none 
      focus:ring-2 focus:ring-blue-500/40 
      hover:bg-white/20
      transition-all duration-200
      placeholder-gray-400
      text-[color:--text-secondary]"
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
