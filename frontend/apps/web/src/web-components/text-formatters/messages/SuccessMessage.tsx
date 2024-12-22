import { CircleCheck } from "lucide-react";

export const SuccessMessage = ({ message }: { message: string }) => {
  return (
    <section>
      <header className="[color:--success-color] flex flex-row items-center justify-center gap-4">
        <CircleCheck />
        <h2 className="text-center w-full">성공했습니다.</h2>
      </header>
      <div className="">{message}</div>
    </section>
  );
};
