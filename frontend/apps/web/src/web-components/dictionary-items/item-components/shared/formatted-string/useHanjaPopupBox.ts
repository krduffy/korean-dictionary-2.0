import { useRef, useState } from "react";

export const useHanjaPopupBox = () => {
  const [showHoverBox, setShowHoverBox] = useState<boolean>(false);

  const enteredTimerInstance = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const timeoutDurationMs = 500;

  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    enteredTimerInstance.current = setTimeout(() => {
      setShowHoverBox(true);
    }, timeoutDurationMs);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    if (enteredTimerInstance.current) {
      clearTimeout(enteredTimerInstance.current);
    }
    setShowHoverBox(false);
  };

  return {
    showHoverBox,
    handleMouseEnter,
    handleMouseLeave,
  };
};
