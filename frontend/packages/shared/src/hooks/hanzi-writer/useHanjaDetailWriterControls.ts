import HanziWriter from "hanzi-writer";
import { useRef } from "react";

export const useHanjaDetailWriterControls = ({
  hanziWriter,
  numStrokes,
}: {
  hanziWriter: HanziWriter;
  numStrokes: number;
}) => {
  /* expected controls are pause, play, step forward and back */

  const nextStroke = useRef<number>(0);
  const isDrawing = useRef<boolean>(false);
  const outlineShown = useRef<boolean>(true);

  const loopingIntervalTimer = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

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
    if (loopingIntervalTimer.current) {
      clearInterval(loopingIntervalTimer.current);
      loopingIntervalTimer.current = null;
    }
  };

  const play = () => {
    if (!loopingIntervalTimer.current) {
      loopingIntervalTimer.current = setInterval(() => stepForward(), 100);
    }
  };

  const stepForward = () => {
    if (isDrawing.current) {
      return;
    }

    isDrawing.current = true;

    const calledOnCompletion = () => {
      nextStroke.current++;
      if (nextStroke.current >= numStrokes) {
        nextStroke.current = 0;
      }
      isDrawing.current = false;
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
