import HanziWriter from "hanzi-writer";
import { useEffect, useRef } from "react";

export const useHanjaDetailWriterAnimator = ({
  hanziWriter,
  numStrokes,
}: {
  hanziWriter: HanziWriter;
  numStrokes: number;
}) => {
  /* expected controls are pause, play, step forward and back.
     i am not using the animateCharacter funcs from hanzi writer
     because i specifically want to be able to be able to step through
     the writing stroke by stroke. this doesnt seem to be in that library */

  const nextStroke = useRef<number>(0);
  const isDrawing = useRef<boolean>(false);
  const outlineShown = useRef<boolean>(false);

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

  const play = (onReachedEndOfSequence: () => void) => {
    /* has to stop once the animation has reached the end;
       a lot of the actual code for this is coupled into the stepForward.
       Does not call animateCharacter because that doesnt update
       nextStroke.current */
    if (!loopingIntervalTimer.current) {
      loopingIntervalTimer.current = setInterval(
        () => stepForward(onReachedEndOfSequence),
        100
      );
    }
  };

  const stepForward = (onReachedEndOfSequence?: () => void) => {
    if (isDrawing.current) {
      return;
    }

    isDrawing.current = true;

    const calledOnCompletion = () => {
      nextStroke.current++;

      /* End of animation sequence */
      if (nextStroke.current >= numStrokes) {
        nextStroke.current = 0;
        /* stops any timers if there is a timer running from play()/on the initial animation
           when the user initially enters the page */
        onReachedEndOfSequence?.();
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

  useEffect(() => {
    if (hanziWriter) {
      play(pause);
    }
  }, [hanziWriter]);

  return {
    pause,
    play: () => play(pause),
    stepForward: () => stepForward(),
    switchOutlineShown,
  };
};
