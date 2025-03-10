import { useUserExamplesListAndForms } from "./useUserExamplesListAndForms";
import {
  UserExampleSentenceType,
  UserImageExampleType,
  UserVideoExampleType,
} from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { useUserExamplesContext } from "../../api-fetchers/user-examples/UserExamplesContextProvider";
import { TopLevelHideableDropdownNoTruncation } from "../../item-components/shared/ReusedFormatters";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { KoreanUserExampleEditInteractionData } from "@repo/shared/types/views/interactionDataTypes";
import { ListedUserExample } from "./ListedUserExample";
import { Plus } from "lucide-react";

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
    <TopLevelHideableDropdownNoTruncation
      title={title}
      droppedDown={droppedDown}
      onDropdownStateToggle={onDropdownStateToggle}
    >
      <div className="flex flex-col gap-6">
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
        {
          <div className="w-full min-h-20 flex items-center justify-center">
            <AddNewItemButton onClick={addNewItem} />
          </div>
        }
      </div>
    </TopLevelHideableDropdownNoTruncation>
  );
};

const AddNewItemButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="rounded-full border-2 p-2
                 bg-[color:--accent-button-color]
                 hover:bg-[color:--accent-button-hover-color]
                 border-[color:--border-color]
                 text-[color:--accent-button-text-color]"
      onClick={onClick}
    >
      <Plus />
    </button>
  );
};
