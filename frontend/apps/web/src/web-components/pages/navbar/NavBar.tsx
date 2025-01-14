import { useFetchProps } from "@repo/shared/hooks/api/useFetchProps";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import {
  BrowserRouter as Router,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { BookOpen, LogIn } from "lucide-react";
import { MoreButton } from "./MoreButton";
import { memo, useEffect } from "react";
import { useCallAPIWeb } from "../../../shared-web-hooks/useCallAPIWeb";
import { LoggedInUserButton } from "./LoggedInUserButton";
import {
  TraditionalHanjaText,
  TraditionalKoreanText,
} from "../../text-formatters/Fonts";
import { useGlobalFunctionsContext } from "@repo/shared/contexts/GlobalFunctionsContextProvider";

export const NavBar = memo(() => {
  const navigate = useNavigate();

  const { globalSubscribe, globalUnsubscribe } = useGlobalFunctionsContext();

  useEffect(() => {
    const listenerData = {
      eventType: "loadedDataChanged",
      onNotification: () => refetch(),
    } as const;

    globalSubscribe("navBarDataChange", listenerData);

    return () => globalUnsubscribe("navBarDataChange", listenerData);
  }, []);

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
          {requestState.response?.username ? (
            <LoggedInUserButton
              username={String(requestState.response.username)}
            />
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
  const location = useLocation();

  return (
    <button
      className="h-full"
      title="로그인"
      onClick={() => {
        navigate("/login", { state: { previousLocation: location } });
      }}
    >
      <LogIn className="h-full w-auto" strokeWidth={1.5} />
    </button>
  );
};
