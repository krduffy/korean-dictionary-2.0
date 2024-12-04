import { useRef } from "react";
import { useHanziWriter } from "@repo/shared/hooks/hanzi-writer/useHanziWriter";
import { HanjaDetailWriterControls } from "./HanjaDetailWriterControls";

export const HanjaDetailHanziWriter = ({
  character,
  onWriterLoadError,
}: {
  character: string;
  onWriterLoadError: () => void;
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);

  const { hanziWriter, numStrokes } = useHanziWriter({
    ref: divRef,
    character: character,
    writerArgs: {},
    onWriterLoadError,
  });

  return (
    <div className="flex flex-col max-h-full max-w-full bg-[color:--background-quaternary] border-2 border-[color:--border-color] rounded-lg">
      <div className="flex flex-1 justify-center items-center h-full w-full">
        <div className="h-full w-full" ref={divRef} />
      </div>
      {hanziWriter && numStrokes && numStrokes > 0 && (
        <HanjaDetailWriterControls
          hanziWriter={hanziWriter}
          numStrokes={numStrokes}
        />
      )}
    </div>
  );
};
