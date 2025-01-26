import { createContext, ReactNode, useContext, useState } from "react";

type LoginStatus = {
  loggedInAs: string | null;
  // eslint-disable-next-line no-unused-vars
  setLoggedInAs: (newValue: string | null) => void;
};

const LoginStatusContext = createContext<LoginStatus | undefined>(undefined);

export const LoginStatusContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [loggedInAs, setLoggedInAs] = useState<string | null>(null);

  return (
    <LoginStatusContext.Provider
      value={{
        loggedInAs: loggedInAs,
        setLoggedInAs: setLoggedInAs,
      }}
    >
      {children}
    </LoginStatusContext.Provider>
  );
};

export const useLoginStatusContext = () => {
  const context = useContext(LoginStatusContext);

  if (context === undefined) {
    throw new Error(
      "useLoginStatusContext must be called from within a context provider"
    );
  }

  return context;
};
