import { useUserExamplesListAndForms } from "./useUserExamplesListAndForms";
import {
  UserExampleSentenceType,
  UserImageExampleType,
  UserVideoExampleType,
} from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { useUserExamplesContext } from "../../api-fetchers/user-examples/UserExamplesContextProvider";
import { Button } from "../../../ui/Button";
import { HideableDropdownNoTruncation } from "../../item-components/shared/ReusedFormatters";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { KoreanUserExampleEditInteractionData } from "@repo/shared/types/views/interactionDataTypes";
import { ListedUserExample } from "./ListedUserExample";

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
  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();
  const { type, title, droppedDown } = useUserExamplesContext();
  const onDropdownStateToggle = (droppedDown: boolean) => {
    const keyMappings: Record<
      "video" | "sentence" | "image",
      keyof KoreanUserExampleEditInteractionData
    > = {
      image: "imagesDroppedDown",
      sentence: "sentencesDroppedDown",
      video: "videosDroppedDown",
    } as const;

    panelDispatchStateChangeSelf({
      type: "update_korean_user_example_edit_interaction_data",
      key: keyMappings[type],
      newValue: droppedDown,
    });
  };

  const {
    listOfDataItems,
    changeField,
    addNewItem,
    saveItemByIndex,
    deleteItemByIndex,
  } = useUserExamplesListAndForms<DataType>({
    initialData: initialData,
  });

  const getIndexAppliedChangeFieldFunc =
    (index: number) =>
    <Field extends keyof DataType>(field: Field, newValue: DataType[Field]) =>
      changeField(index, field, newValue);

  return (
    <HideableDropdownNoTruncation
      title={title}
      droppedDown={droppedDown}
      onDropdownStateToggle={onDropdownStateToggle}
    >
      {listOfDataItems.map((dataItem, id) => (
        <ListedUserExample
          key={id}
          // @ts-ignore
          dataItem={dataItem}
          changeFieldFunction={getIndexAppliedChangeFieldFunc(id)}
          saveFunction={() => saveItemByIndex(id)}
          deleteFunction={() => deleteItemByIndex(id)}
        />
      ))}
      {<AddNewItemButton onClick={addNewItem} />}
    </HideableDropdownNoTruncation>
  );
};

const AddNewItemButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button type="button" onClick={onClick}>
      new
    </Button>
  );
};
