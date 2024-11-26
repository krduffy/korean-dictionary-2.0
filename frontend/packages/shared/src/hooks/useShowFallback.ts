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

  const startTimer = () => {
    fallbackTimer.current = setTimeout(
      () => setShowFallback(false),
      fallbackMaxTimeMs
    );
  };

  const clearTimer = () => {
    if (fallbackTimer.current) {
      clearTimeout(fallbackTimer.current);
    }
  };

  useEffect(() => {
    if (showFallback) {
      clearTimer();
      startTimer();
    }
  }, [showFallback]);

  useEffect(() => {
    if (loading) {
      setShowFallback(true);
    }
  }, [loading]);

  useEffect(() => {
    if (successful) {
      setShowFallback(false);
      clearTimer();
    }
  }, [successful]);

  return {
    showFallback,
  };
};
