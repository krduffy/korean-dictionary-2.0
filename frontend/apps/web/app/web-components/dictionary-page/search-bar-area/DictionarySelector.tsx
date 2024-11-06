import { PopupBox } from "../../misc/PopupBox";
import { useRef } from "react";
import { SearchConfig } from "@repo/shared/types/panelAndViewTypes";
import { useDictionarySelector } from "app/web-hooks/useDictionarySelector";
import { KoreanSearchConfigDropdownMenu } from "./KoreanConfigDropdownMenu";
import {
  UpdateHanjaSearchConfigArgs,
  UpdateKoreanSearchConfigArgs,
} from "@repo/shared/hooks/useSearchBarArea";

export interface DictionarySelectorArgs {
  searchConfig: SearchConfig;
  updateKoreanSearchConfig: ({
    // eslint-disable-next-line no-unused-vars
    field,
    // eslint-disable-next-line no-unused-vars
    value,
  }: UpdateKoreanSearchConfigArgs) => void;
  updateHanjaSearchConfig: ({
    // eslint-disable-next-line no-unused-vars
    field,
    // eslint-disable-next-line no-unused-vars
    value,
  }: UpdateHanjaSearchConfigArgs) => void;
  switchDictionary: () => void;
}

export const DictionarySelector = ({
  searchConfig,
  updateKoreanSearchConfig,
  updateHanjaSearchConfig,
  switchDictionary,
}: DictionarySelectorArgs) => {
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
    searchConfig,
    updateKoreanSearchConfig,
    updateHanjaSearchConfig,
    switchDictionary,
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
          updateKoreanSearchConfig={updateKoreanSearchConfig}
          updateHanjaSearchConfig={updateHanjaSearchConfig}
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
  updateKoreanSearchConfig,
  updateHanjaSearchConfig,
  onDropdownButtonMouseEnter,
  onDropdownButtonMouseLeave,
  getDropdownButtonColor,
  showDropdown,
  onDropdownButtonClick,
}: {
  searchConfig: SearchConfig;
  updateKoreanSearchConfig: ({
    field,
    value,
  }: UpdateKoreanSearchConfigArgs) => void;
  updateHanjaSearchConfig: ({
    field,
    value,
  }: UpdateHanjaSearchConfigArgs) => void;
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
            config={searchConfig.config}
            updateKoreanSearchConfig={updateKoreanSearchConfig}
          />
        ) : (
          <div>hanjajaaaaa</div>
        )}
      </PopupBox>
    </>
  );
};
