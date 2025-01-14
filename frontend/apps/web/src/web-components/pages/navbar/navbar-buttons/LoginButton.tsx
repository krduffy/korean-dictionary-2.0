import { LogIn } from "lucide-react";
import {
  BrowserRouter as Router,
  useLocation,
  useNavigate,
} from "react-router-dom";

export const LoginButton = () => {
  const navigate = useNavigate();

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
