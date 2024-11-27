import { clear } from "console";
import { useEffect, useRef, useState } from "react";

/* needs testing to see if this adequately handles all cases */

export const useShowFallback = ({
  loading,
  successful,
  fallbackMinTimeMs,
  fallbackMaxTimeMs,
}: {
  /** `loading` from useCallAPI instance or a wrapper */
  loading: boolean;
  /** `successful` from useCallAPI instance or a wrapper */
  successful: boolean;
  /** Number of ms until a successful response can be acknowledged and the fallback is allowed
   *  to be overwritten */
  fallbackMinTimeMs: number;
  /** Number of ms until an unsuccessful response is acknowledged and the fallback is
   *  no longer shown */
  fallbackMaxTimeMs: number;
}) => {
  const [showFallback, setShowFallback] = useState<boolean>(true);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getOverwritePromise = () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), fallbackMinTimeMs);
    });
  };

  const allowOverwriteOnFulfillment = useRef<Promise<void> | null>(
    getOverwritePromise()
  );

  const resetFallbackTimers = () => {
    clearTimer();
    allowOverwriteOnFulfillment.current = getOverwritePromise();
  };

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

    return () => clearTimer();
  }, [showFallback]);

  useEffect(() => {
    if (loading) {
      setShowFallback(true);
    }
  }, [loading]);

  const waitThenClear = async () => {
    await allowOverwriteOnFulfillment.current;
    setShowFallback(false);
    clearTimer();
  };

  useEffect(() => {
    if (successful) {
      waitThenClear();
    }
  }, [successful]);

  return {
    showFallback,
    resetFallbackTimers,
  };
};
