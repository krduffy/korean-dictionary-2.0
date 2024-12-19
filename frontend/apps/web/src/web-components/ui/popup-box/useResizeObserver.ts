import { useLayoutEffect, useState } from "react";

export const useResizeObserver = ({
  ref,
}: {
  ref: React.MutableRefObject<HTMLElement | null>;
}) => {
  const [size, setSize] = useState<DOMRect | undefined>(undefined);

  useLayoutEffect(() => {
    if (ref.current) {
      const updateSize = () => {
        setSize(ref.current?.getBoundingClientRect() ?? undefined);
      };

      updateSize();

      const observer = new ResizeObserver(updateSize);

      observer.observe(ref.current);

      return () => observer.disconnect();
    }
  }, [ref.current]);

  return { size };
};
