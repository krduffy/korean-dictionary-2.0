import HanziWriter from "hanzi-writer";
import {
  LucideIcon,
  Pause,
  Play,
  SquareDashed,
  StepForward,
} from "lucide-react";
import { useHanjaDetailWriterControls } from "@repo/shared/hooks/hanzi-writer/useHanjaDetailWriterControls";

export const HanjaDetailWriterControls = ({
  hanziWriter,
  numStrokes,
}: {
  hanziWriter: HanziWriter;
  numStrokes: number;
}) => {
  /* expected controls are pause, play, step forward and back */

  const { pause, play, stepForward, switchOutlineShown } =
    useHanjaDetailWriterControls({
      hanziWriter: hanziWriter,
      numStrokes: numStrokes,
    });

  return (
    <div className="flex flex-row justify-between w-full">
      <HanjaControlButton
        icon={StepForward}
        title="다음 획순 그리기"
        onClick={stepForward}
      />
      <HanjaControlButton icon={Play} title="반복 재생" onClick={play} />
      <HanjaControlButton icon={Pause} title="중지" onClick={pause} />
      <HanjaControlButton
        icon={SquareDashed}
        title="테두리 여부"
        onClick={switchOutlineShown}
      />
    </div>
  );
};

const HanjaControlButton = ({
  icon: Icon,
  title,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  onClick: () => void;
}) => {
  return (
    <button title={title} className="w-full h-full" onClick={onClick}>
      <Icon className="h-full w-full" />
    </button>
  );
};
