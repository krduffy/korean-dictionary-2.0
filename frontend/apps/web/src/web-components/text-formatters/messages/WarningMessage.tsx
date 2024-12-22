import { CircleAlert } from "lucide-react";

export const WarningMessage = ({ message }: { message: string }) => {
  return (
    <section>
      <header className="[color:--success-color] flex flex-row items-center justify-center gap-4">
        <CircleAlert />
        <h2 className="text-center w-full">aaaaaa</h2>
      </header>
      <div className="">{message}</div>
    </section>
  );
};
