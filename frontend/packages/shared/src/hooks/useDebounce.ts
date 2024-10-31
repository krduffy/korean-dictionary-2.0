import { useRef } from "react";

import { GET_REQUEST_DEBOUNCE_TIME_MS } from "../constants";

// eslint-disable-next-line no-unused-vars
type VoidReturnFunction = (...args: any[]) => void;

/* Blocks the same function from being called with the same arguments too many times 
in short succession*/
export const useDebounce = (func: VoidReturnFunction): VoidReturnFunction => {
  const recentArgs: React.MutableRefObject<string[]> = useRef([]);

  const debounced = (...args: any[]) => {
    const argsAsString: string = JSON.stringify(args);

    if (!recentArgs.current.includes(argsAsString)) {
      recentArgs.current.push(argsAsString);

      setTimeout(() => {
        const indexToDelete: number = recentArgs.current.indexOf(argsAsString);
        if (indexToDelete >= 0) {
          recentArgs.current.splice(indexToDelete, 1);
        }
      }, GET_REQUEST_DEBOUNCE_TIME_MS);

      func(...args);
    }
  };

  return debounced;
};
