import { useEffect, useState } from "react";

export const useResponsiveness = ({
  window,
}: {
  window: Window | undefined;
}) => {
  const twoPanelCutoffWidth = 900;

  /* if window not defined then false. */
  const [twoPanelsAllowed, setTwoPanelsAllowed] = useState<boolean>(false);

  useEffect(() => {
    /* never adds the event listener if window is not defined; will always stay as default
       state `false` */
    if (window === undefined) {
      return;
    }

    /* initial value */
    setTwoPanelsAllowed(window.innerWidth >= twoPanelCutoffWidth);

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
