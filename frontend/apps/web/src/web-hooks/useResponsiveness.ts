import { useEffect, useState } from "react";

export const useResponsiveness = () => {
  const twoPanelCutoffWidth = 900;

  const [twoPanelsAllowed, setTwoPanelsAllowed] = useState<boolean>(
    window.innerWidth >= twoPanelCutoffWidth
  );

  useEffect(() => {
    const handleResize = () => {
      setTwoPanelsAllowed(window.innerWidth >= twoPanelCutoffWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    twoPanelsAllowed,
  };
};
