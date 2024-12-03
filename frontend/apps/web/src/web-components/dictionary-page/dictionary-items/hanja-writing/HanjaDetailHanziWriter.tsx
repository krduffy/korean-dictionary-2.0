import { useRef } from "react";
import { useHanziWriter } from "@repo/shared/hooks/hanzi-writer/useHanziWriter";
import { HanjaDetailWriterControls } from "./HanjaDetailWriterControls";

export const HanjaDetailHanziWriter = ({
  character,
  setWriterLoadError,
}: {
  character: string;
  setWriterLoadError: (newValue: boolean) => void;
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);

  const { hanziWriter, numStrokes } = useHanziWriter({
    ref: divRef,
    character: character,
    writerArgs: {},
    setWriterLoadError,
  });

  return (
    <div>
      <div className="h-full w-full" ref={divRef} />
      {hanziWriter && numStrokes && numStrokes > 0 && (
        <HanjaDetailWriterControls
          hanziWriter={hanziWriter}
          numStrokes={numStrokes}
        />
      )}
    </div>
  );
};
