import { useCallback, useRef } from "react";

interface UseSpamProtectedSetterArgs<T> {
  dataGetter: () => Promise<T>;
  // eslint-disable-next-line no-unused-vars
  setter: (data: T) => void;
}

interface UseSpamProtectedSetterReturns<T> {}

export const useSpamProtectedSetter = <T>({
  dataGetter,
  setter,
}: UseSpamProtectedSetterArgs<T>) => {
  const requestRef: React.MutableRefObject<number> = useRef(0);

  const spamProtected = useCallback(async () => {
    requestRef.current++;
    const thisRequestNum = requestRef.current;

    const data = await dataGetter();

    if (requestRef.current === thisRequestNum) {
      setter(data);
    }
  }, [dataGetter, setter]);

  return spamProtected;
};
