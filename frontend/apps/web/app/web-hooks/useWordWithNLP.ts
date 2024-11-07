import { useState } from "react";

export const useHoverState = () => {
  const [hovering, setHovering] = useState(false);

  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setHovering(true);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setHovering(false);
  };

  return {
    hovering,
    handleMouseEnter,
    handleMouseLeave,
  };
};
