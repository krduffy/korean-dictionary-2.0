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
      <SearchBar
        searchTerm={searchConfig.searchTerm}
        setSearchTerm={searchConfigSetters.setSearchTerm}
      />
      <SubmitSearchButton submitSearch={submitSearch} />
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
    <textarea
      value={searchTerm}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setSearchTerm(e.target.value)
      }
    />
  );
};

const SubmitSearchButton = ({
  submitSearch,
}: {
  submitSearch: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return <button onClick={submitSearch}>검색</button>;
};
