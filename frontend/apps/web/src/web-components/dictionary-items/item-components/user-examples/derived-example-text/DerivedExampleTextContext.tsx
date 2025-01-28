import { createContext, ReactNode, useContext, useRef } from "react";

type DerivedExampleTextContextType = {
  sourceTextRef: React.MutableRefObject<HTMLDivElement | null>;
  highlightEojeol: (eojeolNumber: number) => void;
};

const DerivedExampleTextContext = createContext<
  DerivedExampleTextContextType | undefined
>(undefined);

export const DerivedExampleTextContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const sourceTextRef = useRef<HTMLDivElement | null>(null);

  const highlightEojeol = (eojeolNum: number) => {
    if (!sourceTextRef.current) return;

    const eojeolSpan = sourceTextRef.current.querySelector(
      `.eojeol-num-${eojeolNum}`
    );

    if (!eojeolSpan) return;

    eojeolSpan.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    eojeolSpan.classList.add("animate-eojeol-highlight");
    setTimeout(
      () => eojeolSpan.classList.remove("animate-eojeol-highlight"),
      5000
    );
  };

  return (
    <DerivedExampleTextContext.Provider
      value={{
        sourceTextRef: sourceTextRef,
        highlightEojeol: highlightEojeol,
      }}
    >
      {children}
    </DerivedExampleTextContext.Provider>
  );
};

export const useDerivedExampleTextContext = () => {
  const context = useContext(DerivedExampleTextContext);

  if (!context)
    throw new Error(
      "useDerivedExampleTextContext must be called from within a context provider"
    );

  return context;
};
