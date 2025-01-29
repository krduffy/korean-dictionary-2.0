import { HanjaResultRankingType } from "@repo/shared/types/views/dictionary-items/hanjaDictionaryItems";
import { Star } from "lucide-react";
import { memo } from "react";

export function convertHanjaResultRankingIntoNumberOfStars(
  resultRanking: HanjaResultRankingType
) {
  if (resultRanking < 4) return 0;
  if (resultRanking < 7) return 1;
  if (resultRanking < 12) return 2;
  return 3;
}

export const ResultRankingStars = memo(
  ({
    numStars,
    widthAndHeightPx,
  }: {
    numStars: 0 | 1 | 2 | 3;
    widthAndHeightPx: number;
  }) => {
    return (
      <div
        style={{ width: `${widthAndHeightPx}px` }}
        className="relative aspect-square"
      >
        <PositionedStars parentSize={widthAndHeightPx} numStars={numStars} />
      </div>
    );
  }
);

const PositionedStars = ({
  numStars,
  parentSize,
}: {
  numStars: 0 | 1 | 2 | 3;
  parentSize: number;
}) => {
  if (numStars === 0) return;

  const getStarsWithClassNames = (classNames: string[]) => {
    return (
      <>
        {classNames.map((className, id) => (
          <Star
            fill="currentColor"
            size={parentSize / 2}
            key={id}
            className={`text-[color:--accent-2] ${className}`}
          />
        ))}
      </>
    );
  };

  if (numStars === 1) {
    return getStarsWithClassNames([
      "absolute top-1/2 transform -translate-y-1/2 left-1/2 -translate-x-1/2",
    ]);
  }

  if (numStars === 2) {
    return getStarsWithClassNames([
      "absolute left-0 top-1/2 transform -translate-y-1/2",
      "absolute right-0 top-1/2 transform -translate-y-1/2",
    ]);
  }

  /* 3 stars. */
  return getStarsWithClassNames([
    "absolute left-1/2 top-0 transform -translate-x-1/2",
    "absolute left-0 bottom-0",
    "absolute right-0 bottom-0",
  ]);
};
