import { createContext, ReactNode, useContext, useState } from "react";

type LoginStatus = {
  loggedInAs: string | null;
  // eslint-disable-next-line no-unused-vars
  setLoggedInAs: (newValue: string | null) => void;
  isStaff: boolean;
  // eslint-disable-next-line no-unused-vars
  setIsStaff: (newValue: boolean) => void;
};

const LoginStatusContext = createContext<LoginStatus | undefined>(undefined);

export const LoginStatusContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [loggedInAs, setLoggedInAs] = useState<string | null>(null);
  const [isStaff, setIsStaff] = useState<boolean>(false);

  return (
    <LoginStatusContext.Provider
      value={{
        loggedInAs: loggedInAs,
        setLoggedInAs: setLoggedInAs,
        isStaff: isStaff,
        setIsStaff: setIsStaff,
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
