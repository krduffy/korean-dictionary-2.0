import React from "react";
import { LoginForm } from "./LoginForm";
import { PageWithNavBar } from "../web-components/dictionary-page/navbar/PageWithNavBar";

const LoginPage = () => {
  return (
    <PageWithNavBar>
      <LoginForm />
    </PageWithNavBar>
  );
};

export default LoginPage;
