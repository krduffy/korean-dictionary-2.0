import { MoreButton } from "./navbar-buttons/MoreButton";
import { memo } from "react";
import { LoggedInUserButton } from "./navbar-buttons/LoggedInUserButton";
import { useNavBar } from "@repo/shared/hooks/auth/useNavBar";
import { useCallAPIWeb } from "../../../shared-web-hooks/useCallAPIWeb";
import { LoginButton } from "./navbar-buttons/LoginButton";
import { ToDictionaryPageButton } from "./navbar-buttons/ToDictionaryPageButton";
import { useLoginStatusContext } from "@repo/shared/contexts/LoginStatusContextProvider";

export const NavBar = memo(() => {
  useNavBar({
    useCallAPIInstance: useCallAPIWeb({ cacheResults: true }),
  });

  const { loggedInAs } = useLoginStatusContext();

  return (
    <div className="h-full w-full flex flex-row justify-between items-center p-1 bg-[color:--navbar-background]">
      <div className="h-[80%]">
        <ToDictionaryPageButton />
      </div>
      <div className="flex flex-row gap-4 h-[80%]">
        <div className="h-[70%]">
          {loggedInAs !== null ? (
            <LoggedInUserButton username={loggedInAs} />
          ) : (
            <LoginButton />
          )}
        </div>
        <div className="h-[70%]">
          <MoreButton />
        </div>
      </div>
    </div>
  );
});
