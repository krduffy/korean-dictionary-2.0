import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { BookOpen, LogIn, UserRound } from "lucide-react";
import { MoreButton } from "./MoreMenu";
import { memo } from "react";
import { useCallAPIWeb } from "../../../shared-web-hooks/useCallAPIWeb";
import {
  TraditionalHanjaText,
  TraditionalKoreanText,
} from "../../text-formatters/Fonts";

export const NavBar = memo(() => {
  const navigate = useNavigate();

  /* needed to test if the user is logged in */
  const { requestState, refetch } = useFetchProps({
    url: getEndpoint({ endpoint: "user_info" }),
    useCallAPIInstance: useCallAPIWeb({ cacheResults: true }),
  });

  return (
    <div className="h-full w-full flex flex-row justify-between items-center p-1 bg-[color:--navbar-background]">
      <button className="h-[80%]" onClick={() => navigate("/")}>
        <Logo />
      </button>
      <div className="flex flex-row gap-4 h-[80%]">
        <div className="h-[70%]">
          {requestState.response?.user ? (
            <LoggedInUserButton />
          ) : (
            <LoginButton navigate={navigate} />
          )}
        </div>
        <div className="h-[70%]">
          <MoreButton navigate={navigate} />
        </div>
      </div>
    </div>
  );
});

const Logo = () => {
  return (
    <div
      className="text-[color:--accent-button-text-color] bg-[color:--accent-button-color] h-full flex gap-1 items-center p-1 px-3 rounded-2xl"
      title="사전으로 가기"
    >
      <BookOpen className="h-full w-auto mr-2" strokeWidth={1.5} />
      <div className="text-2xl align-bottom mr-1">
        <TraditionalKoreanText>한</TraditionalKoreanText>
        <span>—</span>
        <TraditionalHanjaText>漢</TraditionalHanjaText>
      </div>
      <div className="text-base align-bottom">
        <span>사전</span>
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
      title="로그인"
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
