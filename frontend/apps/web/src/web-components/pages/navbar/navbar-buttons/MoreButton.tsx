import { ButtonWithClickDropdown } from "../../../ui/ButtonWithClickDropdown";
import { Menu, Settings } from "lucide-react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { NavBarDropdownMenu } from "../NavBarDropdownMenu";
import { IconWithLabelButton } from "./IconWithLabelButton";

export const MoreButton = () => {
  const navigate = useNavigate();

  const buttonContent = <Menu className="h-full w-auto" strokeWidth={1.5} />;

  const dropdownContent = <MoreButtonDropdown navigate={navigate} />;

  return (
    <ButtonWithClickDropdown
      title="더 보기"
      buttonContent={buttonContent}
      dropdownContent={dropdownContent}
      positioning={{
        verticalAlignment: {
          hashMarkAlignment: "entirely-after",
          relativeHashMark: "end",
        },
        horizontalAlignment: {
          hashMarkAlignment: "entirely-before",
          relativeHashMark: "end",
        },
      }}
      addXInTopRight={true}
    />
  );
};

const MoreButtonDropdown = ({ navigate }: { navigate: NavigateFunction }) => {
  return (
    <NavBarDropdownMenu>
      <div className="flex flex-col gap-4 pt-6">
        <IconWithLabelButton
          icon={<Settings />}
          onIconClick={() => navigate("/settings")}
          label="설정"
        />
      </div>
    </NavBarDropdownMenu>
  );
};
