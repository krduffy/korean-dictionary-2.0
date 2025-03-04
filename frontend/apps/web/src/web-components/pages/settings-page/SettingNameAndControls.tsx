import { ReactNode, useRef } from "react";
import { useWidthObserver } from "../../../shared-web-hooks/useWidthObserver";

export const SettingNameAndControls = ({
  settingName,
  settingHelp,
  controls,
}: {
  settingName: string;
  settingHelp: string;
  controls: ReactNode;
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);

  const { belowCutoff } = useWidthObserver({
    ref: divRef,
    cutoff: 400,
  });

  return (
    <div
      ref={divRef}
      className={`w-full flex flex-${belowCutoff ? "col" : "row"} p-4
      items-center justify-center`}
    >
      <div
        className={`w-${belowCutoff ? "full" : "[50%]"} text-${belowCutoff ? "center" : "right"} cursor-help px-8 py-2`}
        title={settingHelp}
      >
        {settingName}
      </div>
      <div
        className={`w-${belowCutoff ? "full" : "[50%]"}  text-${belowCutoff ? "center" : "left"}`}
      >
        {controls}
      </div>
    </div>
  );
};
