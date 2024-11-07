import { useState } from "react";

export const useHanjaPopupBox = () => {
  const [showHoverBox, setShowHoverBox] = useState<boolean>(false);

  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setShowHoverBox(true);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setShowHoverBox(false);
  };

  return {
    showHoverBox,
    handleMouseEnter,
    handleMouseLeave,
  };
};
