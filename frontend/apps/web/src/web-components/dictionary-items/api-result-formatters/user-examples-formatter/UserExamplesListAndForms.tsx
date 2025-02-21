import { useUserExamplesListAndForms } from "./useUserExamplesListAndForms";
import {
  UserExampleSentenceType,
  UserImageExampleType,
  UserVideoExampleType,
} from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { useUserExamplesContext } from "../../api-fetchers/user-examples/UserExamplesContextProvider";
import { ReactNode } from "react";
import { Button } from "../../../ui/Button";

export const UserExamplesListAndForms = <
  DataType extends
    | UserVideoExampleType
    | UserExampleSentenceType
    | UserImageExampleType,
>({
  initialData,
}: {
  initialData: DataType[];
}) => {
  const { listOfDataItems, changeField } =
    useUserExamplesListAndForms<DataType>({
      initialData: initialData,
    });

  const getIndexAppliedChangeFieldFunc =
    (index: number) =>
    <Field extends keyof DataType>(field: Field, newValue: DataType[Field]) =>
      changeField(index, field, newValue);

  return (
    <div>
      {listOfDataItems.map((dataItem, id) => (
        <ListedUserExample
          key={id}
          // @ts-ignore
          dataItem={dataItem}
          changeFieldFunction={getIndexAppliedChangeFieldFunc(id)}
          saveFunction={() => {}}
          deleteFunction={() => {}}
        />
      ))}
    </div>
  );
};

const ListedUserExample = <
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
      />
    </UserExampleStyleWrapper>
  );
};

const UserExampleStyleWrapper = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

const DeleteItemButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button type="button" onClick={onClick}>
      <div>x</div>
    </Button>
  );
};

const SaveItemButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button type="button" onClick={onClick}>
      <div>save</div>
    </Button>
  );
};
