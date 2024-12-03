import HanziWriter from "hanzi-writer";
import { useRef } from "react";
import { clearTimeout } from "timers";

export const useHanjaDetailWriterControls = ({
  hanziWriter,
  numStrokes,
}: {
  hanziWriter: HanziWriter;
  numStrokes: number;
}) => {
  /* expected controls are pause, play, step forward and back */

  const nextStroke = useRef<number>(0);
  const loopingRef = useRef<boolean>(false);
  const outlineShown = useRef<boolean>(true);

  const switchOutlineShown = () => {
    if (outlineShown.current) {
      hanziWriter.hideOutline();
      outlineShown.current = false;
    } else {
      hanziWriter.showOutline();
      outlineShown.current = true;
    }
  };

  const pause = () => {
    loopingRef.current = false;
  };

  const play = () => {
    loopingRef.current = true;
    stepForward({
      onCompletion: () => {
        if (loopingRef.current) {
          play();
        }
      },
    });
  };

  const stepForward = ({
    onCompletion,
  }: { onCompletion?: () => void } = {}) => {
    const calledOnCompletion = () => {
      nextStroke.current++;
      if (nextStroke.current >= numStrokes) {
        nextStroke.current = 0;
      }
      onCompletion?.();
    };

    const doAnimation = () =>
      hanziWriter.animateStroke(nextStroke.current, {
        onComplete: calledOnCompletion,
      });

    if (nextStroke.current === 0) {
      hanziWriter.hideCharacter({ onComplete: doAnimation });
    } else {
      doAnimation();
    }
  };

  return {
    pause,
    play,
    stepForward,
    switchOutlineShown,
  };
};
