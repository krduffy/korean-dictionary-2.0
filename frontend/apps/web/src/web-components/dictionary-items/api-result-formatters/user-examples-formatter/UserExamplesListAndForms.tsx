import { useUserExamplesListAndForms } from "./useUserExamplesListAndForms";
import {
  UserExampleSentenceType,
  UserImageExampleType,
  UserVideoExampleType,
} from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { useUserExamplesContext } from "../../api-fetchers/user-examples/UserExamplesContextProvider";
import { ReactNode } from "react";
import { Button } from "../../../ui/Button";
import { HideableDropdownNoTruncation } from "../../item-components/shared/ReusedFormatters";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { KoreanUserExampleEditInteractionData } from "@repo/shared/types/views/interactionDataTypes";

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

  const { listOfDataItems, changeField } =
    useUserExamplesListAndForms<DataType>({
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
          saveFunction={() => {}}
          deleteFunction={() => {}}
        />
      ))}
    </HideableDropdownNoTruncation>
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
      <div className="flex flex-row">
        <div className="w-[80%]">
          <ListedFormComponent
            // @ts-ignore
            data={dataItem}
            // @ts-ignore
            changeField={changeFieldFunction}
          />
        </div>
        <div className="flex flex-col h-full w-[20%]">
          <div className="flex items-center justify-center h-[50%]">
            <SaveItemButton onClick={saveFunction} />
          </div>
          <div className="flex items-center justify-center h-[50%]">
            <DeleteItemButton onClick={deleteFunction} />
          </div>
        </div>
      </div>
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
