import { useRef, useState } from "react";
import { useHanziWriter } from "@repo/shared/hooks/hanzi-writer/useHanziWriter";

export const HanjaDetailHanziWriter = ({
  character,
  setWriterLoadError,
}: {
  character: string;
  setWriterLoadError: (newValue: boolean) => void;
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);

  const { hanziWriter } = useHanziWriter({
    ref: divRef,
    character: character,
    writerArgs: {},
    setWriterLoadError,
  });

  return <div className="h-full w-full" ref={divRef} />;
};
