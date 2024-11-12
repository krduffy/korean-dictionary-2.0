import { useFetchProps } from "@repo/shared/hooks/useFetchProps";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { useCallAPIWeb } from "../../web-hooks/useCallAPIWeb";

import { BookOpen, LogIn, Menu, UserRound } from "lucide-react";
import {
  TraditionalHanjaText,
  TraditionalKoreanText,
} from "../dictionary-page/string-formatters/SpanStylers";
import { useState } from "react";
import { ButtonWithClickDropdown } from "../misc/ButtonWithClickDropdown";

export const NavBar = () => {
  const navigate = useNavigate();

  /* needed to test if the user is logged in */
  const { response } = useFetchProps({
    url: getEndpoint({ endpoint: "user_info" }),
    useAPICallInstance: useCallAPIWeb({ cacheResults: true }).useCallAPIReturns,
  });

  return (
    <div className="h-full w-full flex flex-row justify-between items-center p-1 bg-[color:--navbar-background]">
      <button className="h-[80%]" onClick={() => navigate("/")}>
        <Logo />
      </button>
      <div className="flex flex-row gap-4 h-[80%]">
        <div className="h-[70%]">
          {response?.user ? (
            <LoggedInUserButton />
          ) : (
            <LoginButton navigate={navigate} />
          )}
        </div>
        <div className="h-[70%]">
          <MoreButton />
        </div>
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <div
      className="bg-[color:gold] h-full flex items-center p-1 px-3 rounded-2xl"
      title="사전으로 가기"
    >
      <BookOpen className="h-full w-auto mr-2" strokeWidth={1.5} />
      <div className="text-lg align-bottom mr-1">
        <TraditionalKoreanText>한</TraditionalKoreanText>
        <span>-</span>
        <TraditionalHanjaText>漢</TraditionalHanjaText>
      </div>
      <div className="text-sm align-bottom">
        <span>대사전</span>
      </div>
    </div>
  );
};

const LoginButton = ({
  navigate,
}: {
  navigate: ReturnType<typeof useNavigate>;
}) => {
  return (
    <button
      className="h-full"
      onClick={() => {
        navigate("/login");
      }}
    >
      <LogIn className="h-full w-auto" strokeWidth={1.5} />
    </button>
  );
};

const LoggedInUserButton = () => {
  return (
    <button className="h-full">
      <UserRound className="h-full w-auto" strokeWidth={1.5} />
    </button>
  );
};

const MoreButton = () => {
  const buttonContent = <Menu className="h-full w-auto" strokeWidth={1.5} />;

  const dropdownContent = <MoreButtonDropdown />;

  return (
    <ButtonWithClickDropdown
      buttonContent={buttonContent}
      dropdownContent={dropdownContent}
      popupBoxArgs={{ align: "end" }}
    />
  );
};

const MoreButtonDropdown = () => {
  return <div>dropdown</div>;
};
