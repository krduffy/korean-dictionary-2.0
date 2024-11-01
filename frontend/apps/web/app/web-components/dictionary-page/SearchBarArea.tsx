import {
  SearchConfigSetters,
  SearchConfig,
  SearchConfigDictionary,
} from "@repo/shared/types/panelAndViewTypes";

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
    <div>
      <DictionarySelector
        dictionary={searchConfig.dictionary}
        searchConfigSetters={searchConfigSetters}
      />
      <form>
        <SearchBar
          searchTerm={searchConfig.searchTerm}
          setSearchTerm={searchConfigSetters.setSearchTerm}
        />
        <SubmitSearchButton submitSearch={submitSearch} />
      </form>
    </div>
  );
};

const DictionarySelector = ({
  dictionary,
  searchConfigSetters,
}: {
  dictionary: SearchConfigDictionary;
  searchConfigSetters: SearchConfigSetters;
}) => {
  return (
    <button onClick={() => searchConfigSetters.switchDictionary()}>
      {dictionary === "korean" ? "한" : "漢"}
    </button>
  );
};

const SearchBar = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}) => {
  return (
    <input
      type="search"
      placeholder="검색어를 입력해주세요."
      value={searchTerm}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setSearchTerm(e.target.value)
      }
      className="w-full px-4 py-2 
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
