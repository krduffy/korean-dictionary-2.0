import { ReactNode } from "react";

export const SearchConfigLabelAndSettingArea = ({
  label,
  settingArea,
}: {
  label: string;
  settingArea: ReactNode;
}) => {
  return (
    <div className="flex flex-row gap-4">
      {/* label. */}
      <div className="flex w-[40%] underline justify-center">{label}</div>
      <div className="w-[60%]">{settingArea}</div>
    </div>
  );
};

export const SearchConfigLabelAndSettingAreaDivider = () => {
  return <div className="h-px bg-[color:--accent-5] opacity-20 w-full" />;
};
