import { ReactNode, useRef, useState } from "react";
import { useHanziWriter } from "@repo/shared/hooks/hanzi-writer/useHanziWriter";
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
      <HanjaControlButton icon={Pause} title="pause" onClick={pause} />
      <HanjaControlButton icon={Play} title="play" onClick={play} />
      <HanjaControlButton
        icon={SquareDashed}
        title="outline"
        onClick={switchOutlineShown}
      />
      <HanjaControlButton
        icon={StepForward}
        title="step"
        onClick={stepForward}
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
