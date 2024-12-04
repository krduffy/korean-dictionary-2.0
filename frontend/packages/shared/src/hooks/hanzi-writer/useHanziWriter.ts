import HanziWriter, { HanziWriterOptions } from "hanzi-writer";
import { useEffect, useRef, useState } from "react";

export const useHanziWriter = ({
  ref,
  character,
  writerArgs,
  onWriterLoadError,
}: {
  ref: React.MutableRefObject<HTMLDivElement | null>;
  character: string;
  writerArgs: Partial<HanziWriterOptions>;
  onWriterLoadError: () => void;
}) => {
  const hanziWriterRef = useRef<HanziWriter | null>(null);
  const [numStrokes, setNumStrokes] = useState<number | null>(null);

  useEffect(() => {
    /* ref.current is intentionally checked before and after import */

    const doLoad = async () => {
      import(`./hanzi-writer-data/${character}.json`)
        .then((data) => {
          if (ref.current && !hanziWriterRef.current) {
            hanziWriterRef.current = HanziWriter.create(
              ref.current,
              character,
              {
                ...writerArgs,
                charDataLoader: function (char) {
                  return data;
                },
                onLoadCharDataError: () => onWriterLoadError(),
              }
            );
            setNumStrokes(data.strokes.length);
          }
        })
        .catch(() => {
          onWriterLoadError();
        });
    };

    doLoad();
  }, [ref, character]);

  /* need to change the size of the writer to update when the size of the divref changes */
  useEffect(() => {
    const onResize = () => {
      const dim = ref.current?.getBoundingClientRect();
      if (dim) {
        const newHW = Math.min(dim.height, dim.width);
        hanziWriterRef.current?.updateDimensions({
          height: newHW,
          width: newHW,
        });
      }
    };

    const resizeObserver = new ResizeObserver(onResize);

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
    };
  }, [ref]);

  return {
    hanziWriter: hanziWriterRef.current,
    numStrokes: numStrokes,
  };
};
