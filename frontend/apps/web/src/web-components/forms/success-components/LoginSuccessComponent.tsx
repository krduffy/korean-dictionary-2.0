import { useLocation, useNavigate } from "react-router-dom";
import { BasicSuccessComponent } from "./BasicSuccessComponent";

export const LoginSuccessComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectDelay = 3000;

  const calledOnRender = () => {
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
