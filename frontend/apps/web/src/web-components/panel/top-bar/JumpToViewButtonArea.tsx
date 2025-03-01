import { Globe, House, FileStack, LucideIcon } from "lucide-react";
import { ButtonWithClickDropdown } from "../../ui/ButtonWithClickDropdown";
import { Button } from "../../ui/Button";
import { useId } from "react";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";

export const JumpToViewButtonArea = () => {
  return (
    <ButtonWithClickDropdown
      buttonContent={<JumpToViewGlobeButtonContent />}
      dropdownContent={<JumpToViewPopupBox />}
      positioning={{
        verticalAlignment: {
          hashMarkAlignment: "entirely-after",
          relativeHashMark: "end",
        },
        horizontalAlignment: {
          hashMarkAlignment: "middles-aligned",
          relativeHashMark: "middle",
        },
      }}
      title="이동"
      addXInTopRight={true}
    ></ButtonWithClickDropdown>
  );
};

const JumpToViewGlobeButtonContent = () => {
  return <Globe />;
};

const JumpToViewPopupBox = () => {
  const { panelDispatchStateChangeSelf } = usePanelFunctionsContext();

  return (
    <div className="flex flex-col gap-4 min-h-12 max-h-96 overflow-y-scroll bg-[color:--background-tertiary] px-6 py-3 rounded-md border-4 border-[color:--accent-border-color]">
      <JumpToViewButton
        Icon={House}
        label="홈페이지"
        onClick={() => {
          panelDispatchStateChangeSelf({
            type: "push_homepage",
          });
        }}
      />
      <JumpToViewButton
        Icon={FileStack}
        label="추가한 문서"
        onClick={() => {
          panelDispatchStateChangeSelf({
            type: "push_listed_derived_example_texts",
          });
        }}
      />
    </div>
  );
};

const JumpToViewButton = ({
  Icon,
  label,
  onClick,
}: {
  Icon: LucideIcon;
  label: string;
  onClick: () => void;
}) => {
  const id = useId();

  return (
    <Button onClick={onClick}>
      <div className="flex flex-row gap-4 items-center justify-center">
        <Icon id={id} className="flex-none hover:opacity-50" />
        <label className="flex-1 text-center" htmlFor={id}>
          {label}
        </label>
      </div>
    </Button>
  );
};
