"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

export const NavBar = () => {
  const router: AppRouterInstance = useRouter();

  return (
    <>
      <div>Thisisthenavbar.</div>
      <DictionaryPageButton router={router} />
      <LoginButton router={router} />
    </>
  );
};

const DictionaryPageButton = ({ router }: { router: AppRouterInstance }) => {
  return <button onClick={() => router.push("/")}>main page</button>;
};

const LoginButton = ({ router }: { router: AppRouterInstance }) => {
  return (
    <button
      onClick={() => {
        router.push("/login");
      }}
    >
      Log in.
    </button>
  );
};
