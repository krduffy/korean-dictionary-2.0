import {
  UserExampleSentenceType,
  UserImageExampleType,
  UserVideoExampleType,
} from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { useUserExamplesContext } from "../../api-fetchers/user-examples/UserExamplesContextProvider";
import { ReactNode } from "react";
import { Button } from "../../../ui/Button";

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
