import { ReactNode } from "react";
import { ButtonWithClickDropdown } from "../other/misc/ButtonWithClickDropdown";
import { Menu, Settings } from "lucide-react";
import { NavigateFunction } from "react-router-dom";

export const MoreButton = ({ navigate }: { navigate: NavigateFunction }) => {
  const buttonContent = <Menu className="h-full w-auto" strokeWidth={1.5} />;

  const dropdownContent = <MoreButtonDropdown navigate={navigate} />;

  return (
    <ButtonWithClickDropdown
      title="더 보기"
      buttonContent={buttonContent}
      dropdownContent={dropdownContent}
      popupBoxArgs={{ align: "end" }}
    />
  );
};

const MoreButtonDropdownIconWithLabel = ({
  icon,
  onIconClick,
  label,
}: {
  icon: ReactNode;
  onIconClick: () => void;
  label: string;
}) => {
  return (
    <div className="">
      <button className="" onClick={onIconClick}>
        {icon}
      </button>
      <label className="">{label}</label>
    </div>
  );
};

const MoreButtonDropdown = ({ navigate }: { navigate: NavigateFunction }) => {
  return (
    <div className="flex flex-col gap-4">
      <MoreButtonDropdownIconWithLabel
        icon={<Settings />}
        onIconClick={() => navigate("/settings")}
        label="설정"
      />
    </div>
  );
};
