import {
  UserExampleSentenceType,
  UserImageExampleType,
  UserVideoExampleType,
} from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { ComponentType, createContext, ReactNode, useContext } from "react";

interface UserExamplesContextType<DataType> {
  emptyDataTypeTemplate: Omit<DataType, "id">;
  verifier: (data: unknown) => data is DataType;
  ListedFormComponent: ComponentType<{
    data: Omit<DataType, "id">;
    changeField: <Field extends keyof DataType>(
      field: Field,
      newValue: DataType[Field]
    ) => void;
  }>;
}

export interface UserVideoExampleContextType
  extends UserExamplesContextType<UserVideoExampleType> {
  type: "video";
}

export interface UserExampleSentenceContextType
  extends UserExamplesContextType<UserExampleSentenceType> {
  type: "sentence";
}

export interface UserImageExampleContextType
  extends UserExamplesContextType<UserImageExampleType> {
  type: "image";
}

const userExamplesContext = createContext<
  | UserExampleSentenceContextType
  | UserVideoExampleContextType
  | UserImageExampleContextType
  | undefined
>(undefined);

export const UserExamplesContextProvider = <
  ContextValueType extends
    | UserExampleSentenceContextType
    | UserVideoExampleContextType
    | UserImageExampleContextType,
>({
  children,
  contextValue,
}: {
  children: ReactNode;
  contextValue: ContextValueType;
}) => {
  return (
    <userExamplesContext.Provider value={contextValue}>
      {children}
    </userExamplesContext.Provider>
  );
};

export const useUserExamplesContext = () => {
  const context = useContext(userExamplesContext);

  if (context === undefined) {
    throw new Error(
      "useUserExamplesContext called from outside a context provider"
    );
  }

  return context;
};
