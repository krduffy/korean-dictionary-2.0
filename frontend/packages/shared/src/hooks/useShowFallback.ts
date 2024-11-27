import { useEffect, useRef, useState } from "react";

/* needs testing to see if this adequately handles all cases */

export const useShowFallback = ({
  earlyCanceller,
  fallbackMinTimeMs,
  fallbackMaxTimeMs,
}: {
  /** Variable that when updated to true can lead to an early cancellation of showing fallback */
  earlyCanceller: boolean;
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
    setShowFallback(true);
    clearTimer();
    startTimer();
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

  const waitThenClear = async () => {
    await allowOverwriteOnFulfillment.current;
    setShowFallback(false);
    clearTimer();
  };

  useEffect(() => {
    if (earlyCanceller) {
      waitThenClear();
    }
  }, [earlyCanceller]);

  return {
    showFallback,
    resetFallbackTimers,
  };
};
