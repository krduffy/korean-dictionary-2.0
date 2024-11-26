import { useEffect, useRef, useState } from "react";

/* needs testing to see if this adequately handles all cases */

export const useShowFallback = ({
  loading,
  successful,
  fallbackMaxTimeMs,
}: {
  loading: boolean;
  successful: boolean;
  fallbackMaxTimeMs: number;
}) => {
  const [showFallback, setShowFallback] = useState<boolean>(true);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (loading) {
      setShowFallback(true);
      fallbackTimer.current = setTimeout(
        () => setShowFallback(false),
        fallbackMaxTimeMs
      );
    }

    return () => {
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    };
  }, [loading]);

  useEffect(() => {
    if (successful) {
      setShowFallback(false);

      if (fallbackTimer.current) {
        clearTimeout(fallbackTimer.current);
      }
    }
  }, [successful]);

  return {
    showFallback,
  };
};
