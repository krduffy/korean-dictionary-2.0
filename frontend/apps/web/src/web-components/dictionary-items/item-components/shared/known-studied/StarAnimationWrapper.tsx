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

  const doAnimation = (wrapper: HTMLDivElement) => {
    const sparkles = wrapper.querySelectorAll(".sparkle");

    sparkles.forEach((sparkle, id) => {
      const angle = (360 / numStars) * id;
      const distance = 30;
      const x = Math.cos((angle * Math.PI) / 180) * distance;
      const y = Math.sin((angle * Math.PI) / 180) * distance;

      (sparkle as HTMLElement).style.setProperty("--sparkle-x", `${x}px`);
      (sparkle as HTMLElement).style.setProperty("--sparkle-y", `${y}px`);
    });

    setTimeout(() => {
      sparkles.forEach((sparkle) => sparkle.remove());
    }, 1000);
  };

  useEffect(() => {
    if (wrapperRef.current) {
      doAnimation(wrapperRef.current);
    }
  }, []);

  return (
    <div ref={wrapperRef} className="sparkling-wrapper sparkling">
      {children}
      {[...Array(numStars)].map((_, id) => (
        <div key={id} className="sparkle" />
      ))}
    </div>
  );
};
