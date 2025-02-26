import {
  UserExampleSentenceType,
  UserImageExampleType,
  UserVideoExampleType,
} from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { useState } from "react";
import { useSendDeleteOrUpdateRequest } from "./useSendDeleteOrUpdateRequest";

export const useUserExamplesListAndForms = <
  DataType extends
    | UserExampleSentenceType
    | UserVideoExampleType
    | UserImageExampleType,
>({
  initialData,
}: {
  initialData: DataType[];
}) => {
  const [listOfDataItems, setListOfDataItems] =
    useState<Omit<DataType, "id">[]>(initialData);

  const { addNewItem, saveItemByIndex, deleteItemByIndex } =
    useSendDeleteOrUpdateRequest({ listOfDataItems, setListOfDataItems });

  const changeField = <Field extends keyof DataType>(
    index: number,
    field: Field,
    newValue: DataType[Field]
  ) => {
    setListOfDataItems((prevArr) =>
      prevArr.with(index, {
        ...listOfDataItems[index],
        [field]: newValue,
      } as DataType)
    );
  };

  return {
    listOfDataItems,
    changeField,
    addNewItem,
    saveItemByIndex,
    deleteItemByIndex,
  };
};
