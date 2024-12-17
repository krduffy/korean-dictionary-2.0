import { X } from "lucide-react";

export const CloseButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button className="absolute top-1 right-1" onClick={(e) => onClick()}>
      <X />
    </button>
  );
};
