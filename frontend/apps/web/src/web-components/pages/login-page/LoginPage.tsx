import { PageWithNavBar } from "../navbar/PageWithNavBar";
import { LoginForm } from "../../forms/display/LoginForm";
import { TitledPageContent } from "../TitledPageContent";

export const LoginPage = () => {
  return (
    <PageWithNavBar>
      <div className="h-full w-full flex items-center justify-center">
        <div className="h-[90%] w-[80%] p-6">
          <TitledPageContent title="로그인">
            <LoginForm />
          </TitledPageContent>
        </div>
      </div>
    </PageWithNavBar>
  );
};
