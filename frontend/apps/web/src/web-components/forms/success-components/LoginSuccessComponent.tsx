import { useLocation, useNavigate } from "react-router-dom";
import { BasicSuccessComponent } from "./BasicSuccessComponent";
import { useCachingContext } from "@repo/shared/contexts/CachingContextProvider";
import { ApiEndpoint, getEndpoint } from "@repo/shared/utils/apiAliases";
import { useGlobalFunctionsContext } from "@repo/shared/contexts/GlobalFunctionsContextProvider";

export const LoginSuccessComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { keepOnlyUrlsWithOneOfSubstrings } = useCachingContext();
  const { globalEmit } = useGlobalFunctionsContext();

  const keptEndpointsAfterLogin: ApiEndpoint[] = ["find_lemma"];
  const keptSubstringsAfterLogin = keptEndpointsAfterLogin.map((endpoint) =>
    getEndpoint({ endpoint: endpoint })
  );

  const redirectDelay = 3000;

  const calledOnRender = () => {
    keepOnlyUrlsWithOneOfSubstrings(keptSubstringsAfterLogin);
    globalEmit("navBarDataChange", {
      eventType: "loadedDataChanged",
      passToCallback: undefined,
    });

    setTimeout(() => {
      const previousPage = location.state.previousLocation;
      navigate(previousPage);
    }, redirectDelay);
  };

  return (
    <BasicSuccessComponent
      successString={"로그인이 성공했습니다."}
      calledOnRender={calledOnRender}
    />
  );
};
