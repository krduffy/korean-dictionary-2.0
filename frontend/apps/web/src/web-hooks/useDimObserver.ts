import { MutableRefObject, useEffect, useState } from "react";

export const useWidthObserver = ({
  ref,
  cutoff,
}: {
  ref: MutableRefObject<HTMLElement | null>;
  cutoff: number;
}) => {
  const [belowCutoff, setBelowCutoff] = useState(false);

  useEffect(() => {
    const onSizeChange = () => {
      const dim = ref.current?.getBoundingClientRect();
      if (dim) {
        setBelowCutoff(dim.width < cutoff);
      }
    };

    const resizeObserver = new ResizeObserver(onSizeChange);

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      if (ref.current) resizeObserver.unobserve(ref.current);
    };
  });

  return {
    belowCutoff,
  };
};
