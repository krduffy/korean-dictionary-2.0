import { useContext, createContext, ReactNode } from "react";
import { useCache } from "../hooks/cache/useCache";
import { UseCacheReturns } from "../types/cacheTypes";
import { useGlobalFunctionsContext } from "./GlobalFunctionsContextProvider";

export const CachingContext = createContext<UseCacheReturns | null>(null);

export const CachingContextProvider = ({
  children,
  cacheCapacity,
}: {
  children: ReactNode;
  cacheCapacity: number;
}) => {
  const { globalSubscribe, globalUnsubscribe } = useGlobalFunctionsContext();

  const { clear, put, retrieve, setItemListenerArgs } = useCache({
    capacity: cacheCapacity,
    globalSubscribe,
    globalUnsubscribe,
  });

  return (
    <CachingContext.Provider
      value={{
        clear,
        put,
        retrieve,
        setItemListenerArgs,
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
