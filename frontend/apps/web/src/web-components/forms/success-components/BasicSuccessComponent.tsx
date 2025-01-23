import { useEffect } from "react";

export const BasicSuccessComponent = ({
  successString,
  calledOnRender,
}: {
  successString: string;
  calledOnRender?: () => void;
}) => {
  useEffect(() => {
    calledOnRender?.();
  }, []);

  return (
    <div className="h-full w-full p-4 flex items-center justify-center">
      {successString}
    </div>
  );
};
