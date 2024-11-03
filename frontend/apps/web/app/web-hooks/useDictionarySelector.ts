import { useState } from "react";

export const useDictionarySelector = ({ switchDictionary }) => {
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
    | "var(--accent-secondary)"
    | "var(--accent-primary)" =>
    mainButtonHovering ? "var(--accent-secondary)" : "var(--accent-primary)";

  const onDropdownButtonMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setMainButtonHovering(false);
    setDropdownButtonHovering(true);
  };

  const onDropdownButtonMouseLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setDropdownButtonHovering(false);
  };

  const getDropdownButtonColor = ():
    | "var(--text-secondary)"
    | "var(--accent-primary)" => {
    if (!dropdownButtonHovering && !showDropdown) {
      return "var(--text-secondary)";
    } else if (dropdownButtonHovering && !showDropdown) {
      return "var(--accent-primary)";
    } else if (!dropdownButtonHovering && showDropdown) {
      return "var(--accent-primary)";
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
