import { useEffect, useRef, useState } from "react";

/* needs testing to see if this adequately handles all cases */

export const useShowFallback = ({
  loading,
  successful,
  fallbackMaxTimeMs,
}: {
  /** `loading` from useCallAPI instance or a wrapper */
  loading: boolean;
  /** `successful` from useCallAPI instance or a wrapper */
  successful: boolean;
  /** Number of ms until an unsuccessful response is acknowledged and the fallback is
   *  no longer shown */
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
