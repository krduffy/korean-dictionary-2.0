import { useFetchProps } from "@repo/shared/hooks/useFetchProps";
import { getEndpoint } from "@repo/shared/utils/apiAliases";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { useCallAPIWeb } from "../../web-hooks/useCallAPIWeb";

import { BookOpen } from "lucide-react";

export const NavBar = () => {
  const navigate = useNavigate();

  /* needed to test if the user is logged in */
  const { successful, error, loading, response } = useFetchProps({
    url: getEndpoint({ endpoint: "user_info" }),
    useAPICallInstance: useCallAPIWeb({ cacheResults: true }).useCallAPIReturns,
  });

  return (
    <div className="h-full w-full flex flex-row items-center">
      <div className="h-full flex items-center">
        <BookOpen className="h-full w-auto" strokeWidth={1.5} />
      </div>
      {/* main button to be taken to the dictionary */}
      <DictionaryPageButton navigate={navigate} />
      <LoginButton navigate={navigate} />
    </div>
  );
};

const DictionaryPageButton = ({
  navigate,
}: {
  navigate: ReturnType<typeof useNavigate>;
}) => {
  return <button onClick={() => navigate("/")}>Main Page</button>;
};

const LoginButton = ({
  navigate,
}: {
  navigate: ReturnType<typeof useNavigate>;
}) => {
  return (
    <button
      onClick={() => {
        navigate("/login");
      }}
    >
      Log In
    </button>
  );
};
