import { useCallback, useRef } from "react";

interface UseSpamProtectedSetterArgs<T> {
  dataGetter: () => Promise<T>;
  // eslint-disable-next-line no-unused-vars
  setter: React.Dispatch<React.SetStateAction<T>>;
}

/** Protects a setter from spammed requests (ie in the search bar). The point is that the
 * most recently made call to set should be the one going through even if earlier made
 * calls' data getter calls resolve first.
 *
 * For example,
 *
 * If setter is the setter that sets the search results on the main page, with search words
 * "apple", "banana", "citrus", in that order and the api calls take 400, 200, and 1000 ms
 * respectively, "citrus"'s results should be set and the first two should block even though
 * they resolved first.
 */
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
