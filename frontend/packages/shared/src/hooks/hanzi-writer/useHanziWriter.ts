import HanziWriter, { HanziWriterOptions } from "hanzi-writer";
import { useEffect, useRef } from "react";

export const useHanziWriter = ({
  ref,
  character,
  writerArgs,
  setWriterLoadError,
}: {
  ref: React.MutableRefObject<HTMLDivElement | null>;
  character: string;
  writerArgs: Partial<HanziWriterOptions>;
  setWriterLoadError: (newValue: boolean) => void;
}) => {
  const hanziWriterRef = useRef<HanziWriter | null>(null);

  useEffect(() => {
    /* ref.current is intentionally checked before and after import */

    const doLoad = async () => {
      try {
        import(`./hanzi-writer-data/${character}.json`).then((data) => {
          if (ref.current && !hanziWriterRef.current) {
            hanziWriterRef.current = HanziWriter.create(
              ref.current,
              character,
              {
                ...writerArgs,
                charDataLoader: function (char) {
                  return data;
                },
                onLoadCharDataError: () => setWriterLoadError(true),
              }
            );
          }
        });
      } catch {
        setWriterLoadError(true);
      }
    };

    doLoad();
  }, [ref, character]);

  return {
    hanziWriter: hanziWriterRef.current,
  };
};
