import { ReactNode } from "react";
import { Button } from "../../../ui/Button";

export const IconWithLabelButton = ({
  icon,
  onIconClick,
  label,
}: {
  icon: ReactNode;
  onIconClick: () => void;
  label: string;
}) => {
  return (
    <Button onClick={onIconClick}>
      <div className="flex flex-row gap-2 items-center justify-center cursor-pointer">
        <div>{icon}</div>
        <div>{label}</div>
      </div>
    </Button>
  );
};
