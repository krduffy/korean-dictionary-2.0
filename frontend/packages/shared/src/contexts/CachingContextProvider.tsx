import { useContext, createContext, ReactNode } from "react";
import { useCache } from "../hooks/useCache";
import { UseCacheReturns } from "../types/cacheTypes";

export const CachingContext = createContext<UseCacheReturns | null>(null);

export const CachingContextProvider = ({
  children,
  cacheCapacity,
}: {
  children: ReactNode;
  cacheCapacity: number;
}) => {
  const { clear, put, retrieve } = useCache({ capacity: cacheCapacity });

  return (
    <CachingContext.Provider
      value={{
        clear,
        put,
        retrieve,
      }}
    >
      {children}
    </CachingContext.Provider>
  );
};

export const useCachingContext = () => {
  const context = useContext(CachingContext);
  if (!context) {
    throw new Error(
      "useCachingContext must be called from within a context provider."
    );
  }
  return context;
};
