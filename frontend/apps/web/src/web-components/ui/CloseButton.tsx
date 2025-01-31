import { X } from "lucide-react";

export const CloseButton = ({
  onClick,
  title,
}: {
  onClick: () => void;
  title?: string;
}) => {
  return (
    <button
      aria-label="close-button"
      className="absolute top-1 right-1"
      onClick={onClick}
      title={title || "닫기"}
    >
      <X />
    </button>
  );
};
