import { PopupBox } from "../../misc/PopupBox";
import { useRef } from "react";
import { SearchConfig } from "@repo/shared/types/panelAndViewTypes";
import { useDictionarySelector } from "app/web-hooks/useDictionarySelector";
import { KoreanSearchConfigDropdownMenu } from "./KoreanConfigDropdownMenu";
import {
  UpdateHanjaSearchConfigArgs,
  UpdateKoreanSearchConfigArgs,
} from "@repo/shared/hooks/useSearchBarArea";
import { SpanPicture } from "app/web-components/misc/SpanPicture";

import { MoreHorizontal, MoreVertical } from "lucide-react";

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
      className="relative h-full w-full
    rounded-lg
    font-medium
    shadow-sm
    transition-all 
    duration-200
    grid grid-rows-3 grid-cols-3 p-1"
    >
      {/* 8 by 8 grid */}
      <div className="row-start-1 row-end-4 col-start-1 col-end-4 h-full w-full">
        <SpanPicture
          string={searchConfig.dictionary === "korean" ? "한" : "漢"}
        />
      </div>

      <div className="row-start-3 col-start-3 h-full w-full">
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
      </div>
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
      <div
        ref={arrowRef}
        className="cursor-pointer w-full h-full"
        style={{
          color: getDropdownButtonColor(),
        }}
        onMouseEnter={onDropdownButtonMouseEnter}
        onMouseLeave={onDropdownButtonMouseLeave}
        onClick={onDropdownButtonClick}
      >
        {showDropdown ? (
          <MoreVertical className="w-full h-full" />
        ) : (
          <MoreHorizontal className="w-full h-full" />
        )}
      </div>

      {/* popup box with the settings options */}
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
