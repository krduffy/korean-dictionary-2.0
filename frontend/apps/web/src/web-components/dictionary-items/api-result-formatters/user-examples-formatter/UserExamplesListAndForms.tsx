import { useUserExamplesListAndForms } from "./useUserExamplesListAndForms";
import {
  UserExampleSentenceType,
  UserImageExampleType,
  UserVideoExampleType,
} from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { useUserExamplesContext } from "../../api-fetchers/user-examples/UserExamplesContextProvider";

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

  const { ListedFormComponent } = useUserExamplesContext();

  const getIndexAppliedChangeFieldFunc =
    (index: number) =>
    <Field extends keyof DataType>(field: Field, newValue: DataType[Field]) =>
      changeField(index, field, newValue);

  return (
    <div>
      {listOfDataItems.map((dataItem, id) => (
        <ListedFormComponent
          // @ts-ignore
          data={dataItem}
          // @ts-ignore
          changeField={getIndexAppliedChangeFieldFunc(id)}
          key={id}
        />
      ))}
    </div>
  );
};
