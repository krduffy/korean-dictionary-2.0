import { SearchSettingsButton } from "./SearchSettingsButton";

import { useSearchBarArea } from "@repo/shared/hooks/useSearchBarArea";
import { SearchIcon } from "lucide-react";
import { useSettingsContext } from "../../../../web-contexts/SettingsContext";
import { SearchBarConfig } from "@repo/shared/types/views/searchConfigTypes";
import { PanelStateAction } from "@repo/shared/types/panel/panelStateActionTypes";
import { memo } from "react";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";

export const SearchBarArea = memo(
  ({ searchConfig }: { searchConfig: SearchBarConfig }) => {
    const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();
    const { keyboardConversionSettings } = useSettingsContext();
    const {
      submitSearch,
      updateKoreanSearchConfig,
      updateHanjaSearchConfig,
      updateSearchTerm,
      switchDictionary,
      deleteSearchConfigItemByKey,
    } = useSearchBarArea({
      searchConfig: searchConfig,
      panelDispatchStateChangeSelf: panelDispatchStateChangeSelf,
      doConversion: keyboardConversionSettings.doConversion,
    });

    return (
      <div className="flex flex-row items-center pr-3 h-full w-full rounded-full bg-[color:--background-quaternary]">
        <div className="h-full flex flex-1">
          <SearchBar
            searchTerm={searchConfig.config.search_term}
            updateSearchTerm={updateSearchTerm}
            submitSearch={submitSearch}
          />
        </div>
        <div className="h-full w-6 ml-1">
          <SearchSettingsButton
            searchConfig={searchConfig}
            updateKoreanSearchConfig={updateKoreanSearchConfig}
            updateHanjaSearchConfig={updateHanjaSearchConfig}
            switchDictionary={switchDictionary}
            deleteSearchConfigItemByKey={deleteSearchConfigItemByKey}
          />
        </div>
      </div>
    );
  }
);

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
        className="h-full absolute top-0 left-0 pl-2"
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
      bg-[color:--neutral-color-not-hovering]
      border border-[color:--border-color]
      rounded-full
      outline-none text-[color:--text-primary]
      focus:ring-2 focus:border-[color:--focus-blue]
      hover:bg-[color:--neutral-color-hovering]
      transition-all duration-200
      "
      />
    </form>
  );
};
