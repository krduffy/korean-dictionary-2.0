import { Star } from "lucide-react";

export const ResultRankingStars = ({
  numStars,
}: {
  numStars: 0 | 1 | 2 | 3;
}) => {
  return (
    <div className="p-4">
      <PositionedStars numStars={numStars} />
    </div>
  );
};

const PositionedStars = ({ numStars }: { numStars: 0 | 1 | 2 | 3 }) => {
  if (numStars === 0) return;

  if (numStars === 1) {
    return (
      <div className="flex items-center justify-center">
        <Star className="" />
      </div>
    );
  }

  if (numStars === 2) {
    return (
      <div className="flex justify-center items-center flex-row">
        <div className="">
          <Star />
        </div>
        <div>
          <Star />
        </div>
      </div>
    );
  }

  // num is 3

  return (
    <div>
      <Star />
      <Star />
      <Star />
    </div>
  );
};
