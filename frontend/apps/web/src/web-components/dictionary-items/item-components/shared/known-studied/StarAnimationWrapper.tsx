import { ReactNode, useEffect, useRef } from "react";
import "./sparkle.css";

export const StarAnimationWrapper = ({
  children,
  numStars,
}: {
  children: ReactNode;
  numStars: number;
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.remove("sparkling");
      void wrapperRef.current.offsetWidth;
      wrapperRef.current.classList.add("sparkling");

      const sparkles = wrapperRef.current.querySelectorAll(".sparkle");

      sparkles.forEach((sparkle, id) => {
        const angle = (360 / numStars) * id;
        const distance = 40;
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;

        (sparkle as HTMLElement).style.setProperty("--sparkle-x", `${x}px`);
        (sparkle as HTMLElement).style.setProperty("--sparkle-y", `${y}px`);
      });
    }
  }, []);

  return (
    <div ref={wrapperRef} className="sparkling-wrapper">
      {children}
      {[...Array(numStars)].map((_, id) => (
        <div key={id} className="sparkle" />
      ))}
    </div>
  );
};
