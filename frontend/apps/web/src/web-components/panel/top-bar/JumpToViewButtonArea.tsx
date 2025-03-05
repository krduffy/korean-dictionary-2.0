import { Globe, House, FileStack, LucideIcon } from "lucide-react";
import { ButtonWithClickDropdown } from "../../ui/ButtonWithClickDropdown";
import { Button } from "../../ui/Button";
import { useId } from "react";
import { usePanelFunctionsContext } from "@repo/shared/contexts/PanelFunctionsContextProvider";
import { useLoginStatusContext } from "@repo/shared/contexts/LoginStatusContextProvider";

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
  const { loggedInAs } = useLoginStatusContext();

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
      {loggedInAs !== null && (
        <JumpToViewButton
          Icon={FileStack}
          label="추가한 문서"
          onClick={() => {
            panelDispatchStateChangeSelf({
              type: "push_listed_derived_example_texts",
            });
          }}
        />
      )}
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
  return (
    <Button onClick={onClick}>
      <div className="flex flex-row gap-4 items-center justify-center">
        <Icon className="flex-none hover:opacity-50" />
        <div className="flex-1 text-center">{label}</div>
      </div>
    </Button>
  );
};
