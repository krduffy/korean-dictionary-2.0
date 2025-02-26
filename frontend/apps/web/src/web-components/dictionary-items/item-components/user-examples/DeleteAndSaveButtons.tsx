import { Button } from "../../../ui/Button";
import { Save, Trash2 } from "lucide-react";

export const DeleteAndSaveButtons = ({
  saveFunction,
  deleteFunction,
}: {
  saveFunction: () => void;
  deleteFunction: () => void;
}) => {
  return (
    <div className="flex flex-row justify-center items-center gap-6">
      <div className="flex items-center justify-center h-[50%]">
        <SaveItemButton onClick={saveFunction} />
      </div>
      <div className="flex items-center justify-center h-[50%]">
        <DeleteItemButton onClick={deleteFunction} />
      </div>
    </div>
  );
};

const DeleteItemButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button title="삭제" type="button" onClick={onClick}>
      <Trash2 />
    </Button>
  );
};

const SaveItemButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button title="저장" type="button" onClick={onClick}>
      <Save />
    </Button>
  );
};
