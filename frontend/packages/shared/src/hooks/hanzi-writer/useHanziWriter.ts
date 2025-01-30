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

  const [forceReload, setForceReload] = useState<number>(0);

  useEffect(() => {
    /* `character` cannot be a direct dependency of the effect that fetches
       the data and populates `ref`. In the case of navigation from one hanja
       detail page to another for another character, if there is a cache hit
       on the data for the second character then the data loads so quickly
       that the outer display component never unmounts and so neither does
       the hanzi writer. As a result, the `hanziWriterRef.current` is still
       truthy and the character in the writer window will not change. This 
       effect is just a way to indirectly make sure that if the character is
       changed then the hanzi writer is starting with a blank `ref` and a null
       `hanziWriterRef.current`. Having this logic as a cleanup function in
       the effect below also doesn't work because it would not be called
       (it never unmounts) */
    const refElements = ref.current?.getElementsByTagName("*");
    if (refElements) {
      for (const element of refElements) {
        element.remove();
      }
    }
    hanziWriterRef.current = null;

    setForceReload((prev) => prev + 1);
  }, [character]);

  useEffect(() => {
    const doLoad = async () => {
      import(`./hanzi-writer-data/${character}.json`)
        .then((data) => {
          if (ref.current && !hanziWriterRef.current) {
            hanziWriterRef.current = HanziWriter.create(
              ref.current,
              character,
              {
                ...writerArgs,
                // eslint-disable-next-line no-unused-vars
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
  }, [ref, forceReload]);

  /* need to change the size of the writer to update when the size of the divref changes */
  useEffect(() => {
    const onResize = () => {
      const dim = ref.current?.getBoundingClientRect();
      if (dim) {
        /* height and width same */
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
