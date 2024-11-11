import { useState } from "react";
import { DictionarySelectorArgs } from "app/web-components/dictionary-page/search-bar-area/DictionarySelector";

interface UseDictionarySelectorArgs extends DictionarySelectorArgs {
  switchDictionary: () => void;
}

export const useDictionarySelector = ({
  searchConfig,
  updateKoreanSearchConfig,
  updateHanjaSearchConfig,
  switchDictionary,
}: UseDictionarySelectorArgs) => {
  const [mainButtonHovering, setMainButtonHovering] = useState(false);
  const [dropdownButtonHovering, setDropdownButtonHovering] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const onMainButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!showDropdown) {
      setMainButtonHovering(true);
    }
  };

  const onMainButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMainButtonHovering(false);
  };

  const onMainButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!showDropdown) {
      switchDictionary();
    }
  };

  const getMainButtonBackgroundColor = ():
    | "var(--accent-button-color)"
    | "var(--accent-button-hover-color)" =>
    mainButtonHovering
      ? "var(--accent-button-hover-color)"
      : "var(--accent-button-color)";

  const onDropdownButtonMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setMainButtonHovering(false);
    setDropdownButtonHovering(true);
  };

  const onDropdownButtonMouseLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setMainButtonHovering(true);
    setDropdownButtonHovering(false);
  };

  const getDropdownButtonColor = ():
    | "var(--text-secondary)"
    | "var(--accent-1)" => {
    if (!dropdownButtonHovering && !showDropdown) {
      return "var(--text-secondary)";
    } else if (dropdownButtonHovering && !showDropdown) {
      return "var(--accent-1)";
    } else if (!dropdownButtonHovering && showDropdown) {
      return "var(--accent-1)";
    } else {
      /** smallArrowHovering && showDropdown */
      return "var(--text-secondary)";
    }
  };

  const onDropdownButtonClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  return {
    onMainButtonMouseEnter,
    onMainButtonMouseLeave,
    onMainButtonClick,
    onDropdownButtonMouseEnter,
    onDropdownButtonMouseLeave,
    getMainButtonBackgroundColor,
    getDropdownButtonColor,
    showDropdown,
    onDropdownButtonClick,
  };
};
