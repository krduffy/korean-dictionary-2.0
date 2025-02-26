import {
  UserExampleSentenceType,
  UserImageExampleType,
  UserVideoExampleType,
} from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { useUserExamplesContext } from "../../api-fetchers/user-examples/UserExamplesContextProvider";
import { ReactNode } from "react";

export const ListedUserExample = <
  DataType extends
    | UserVideoExampleType
    | UserExampleSentenceType
    | UserImageExampleType,
>({
  dataItem,
  changeFieldFunction,
  saveFunction,
  deleteFunction,
}: {
  dataItem: DataType;
  changeFieldFunction: <Field extends keyof DataType>(
    field: Field,
    newValue: DataType[Field]
  ) => void;
  saveFunction: () => void;
  deleteFunction: () => void;
}) => {
  const { ListedFormComponent } = useUserExamplesContext();

  return (
    <UserExampleStyleWrapper>
      <ListedFormComponent
        // @ts-ignore
        data={dataItem}
        // @ts-ignore
        changeField={changeFieldFunction}
        saveFunction={saveFunction}
        deleteFunction={deleteFunction}
      />
    </UserExampleStyleWrapper>
  );
};

const UserExampleStyleWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className="bg-[color:--background-tertiary] rounded-2xl 
          shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[color:--border-color] p-4"
    >
      {children}
    </div>
  );
};
