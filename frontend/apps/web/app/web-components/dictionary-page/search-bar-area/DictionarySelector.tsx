import { PopupBox } from "../../misc/PopupBox";
import { useRef } from "react";
import {
  SearchConfigSetters,
  SearchConfig,
} from "@repo/shared/types/panelAndViewTypes";
import { useDictionarySelector } from "app/web-hooks/useDictionarySelector";
import { KoreanSearchConfigDropdownMenu } from "./KoreanConfigDropdownMenu";
export const DictionarySelector = ({
  searchConfig,
  searchConfigSetters,
}: {
  searchConfig: SearchConfig;
  searchConfigSetters: SearchConfigSetters;
}) => {
  const {
    onMainButtonMouseEnter,
    onMainButtonMouseLeave,
    onMainButtonClick,
    onDropdownButtonMouseEnter,
    onDropdownButtonMouseLeave,
    getMainButtonBackgroundColor,
    getDropdownButtonColor,
    showDropdown,
    onDropdownButtonClick,
  } = useDictionarySelector({
    switchDictionary: searchConfigSetters.switchDictionary,
  });

  return (
    <button
      onClick={onMainButtonClick}
      onMouseEnter={onMainButtonMouseEnter}
      onMouseLeave={onMainButtonMouseLeave}
      style={{
        backgroundColor: getMainButtonBackgroundColor(),
        cursor: showDropdown ? "not-allowed" : "pointer",
      }}
      className="relative h-full w-full px-4 py-2 
    text-white 
    rounded-lg
    font-medium
    shadow-sm
    transition-all 
    duration-200
    flex items-center gap-2"
    >
      <span>{searchConfig.dictionary === "korean" ? "한" : "漢"}</span>
      <span className="absolute text-xs right-1 bottom-0">
        <SearchConfigDropdownMenuToggler
          searchConfig={searchConfig}
          searchConfigSetters={searchConfigSetters}
          onDropdownButtonMouseEnter={onDropdownButtonMouseEnter}
          onDropdownButtonMouseLeave={onDropdownButtonMouseLeave}
          getDropdownButtonColor={getDropdownButtonColor}
          showDropdown={showDropdown}
          onDropdownButtonClick={onDropdownButtonClick}
        />
      </span>
    </button>
  );
};

const SearchConfigDropdownMenuToggler = ({
  searchConfig,
  searchConfigSetters,
  onDropdownButtonMouseEnter,
  onDropdownButtonMouseLeave,
  getDropdownButtonColor,
  showDropdown,
  onDropdownButtonClick,
}: {
  searchConfig: SearchConfig;
  searchConfigSetters: SearchConfigSetters;
  onDropdownButtonMouseEnter: (e: React.MouseEvent<HTMLSpanElement>) => void;
  onDropdownButtonMouseLeave: (e: React.MouseEvent<HTMLSpanElement>) => void;
  getDropdownButtonColor: () => string;
  showDropdown: boolean;
  onDropdownButtonClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
}) => {
  const arrowRef = useRef(null);

  return (
    <>
      <span
        ref={arrowRef}
        className="cursor-pointer m-px"
        style={{
          color: getDropdownButtonColor(),
        }}
        onMouseEnter={onDropdownButtonMouseEnter}
        onMouseLeave={onDropdownButtonMouseLeave}
        onClick={onDropdownButtonClick}
      >
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
