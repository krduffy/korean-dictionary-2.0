"use client";

import { useState } from "react";

export const useDictionaryPage = () => {
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(false);

  return {
    showLeft,
    setShowLeft,
    showRight,
    setShowRight,
  };
};
