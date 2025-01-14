import { UserCheck } from "lucide-react";
import { ButtonWithClickDropdown } from "../../ui/ButtonWithClickDropdown";
import { NavBarDropdownMenu } from "./NavBarDropdownMenu";

export const LoggedInUserButton = ({ username }: { username: string }) => {
  const buttonContent = (
    <UserCheck className="h-full w-auto" strokeWidth={1.5} />
  );

  const dropdownContent = <LoggedInUserButtonDropdown username={username} />;

  return (
    <ButtonWithClickDropdown
      title={`${username}님께서 로그인하셨습니다.`}
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

const LoggedInUserButtonDropdown = ({ username }: { username: string }) => {
  return (
    <NavBarDropdownMenu>
      <div className="flex flex-row gap-4">
        <div className="w-[50%]">
          <LeftSideOfDropdown username={username} />
        </div>
        <div className="w-[50%]">
          <RightSideOfDropdown />
        </div>
      </div>
    </NavBarDropdownMenu>
  );
};

const LeftSideOfDropdown = ({ username }: { username: string }) => {
  const menuTitle = `${username}님`;

  return <div className="whitespace-nowrap text-[150%]">{menuTitle}</div>;
};

const RightSideOfDropdown = () => {
  return <div>로그아웃</div>;
};
