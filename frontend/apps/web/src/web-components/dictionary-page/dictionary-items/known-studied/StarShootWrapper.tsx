import { ReactNode, useRef } from "react";
import "./sparkle.css";

export const useStarAnimation = ({
  buttonContent,
  numStars,
}: {
  buttonContent: ReactNode;
  numStars: number;
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const triggerAnimation = () => {
    if (buttonRef.current) {
      buttonRef.current.classList.remove("sparkling");
      void buttonRef.current.offsetWidth;
      buttonRef.current.classList.add("sparkling");

      const sparkles = buttonRef.current.querySelectorAll(".sparkle");

      sparkles.forEach((sparkle, id) => {
        const angle = (360 / numStars) * id;
        const distance = 40;
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;

        (sparkle as HTMLElement).style.setProperty("--sparkle-x", `${x}px`);
        (sparkle as HTMLElement).style.setProperty("--sparkle-y", `${y}px`);
      });
    }
  };

  const sparkleWrappedChild = (
    <button className="sparkling-button" ref={buttonRef}>
      {buttonContent}
      {[...Array(numStars)].map((_, id) => (
        <div key={id} className="sparkle" />
      ))}
    </button>
  );

  return {
    sparkleWrappedChild,
    triggerAnimation,
  };
};
