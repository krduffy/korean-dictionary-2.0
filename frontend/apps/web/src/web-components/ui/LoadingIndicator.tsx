export const LoadingIndicator = ({
  maxDim,
}: {
  maxDim?: number | undefined;
}) => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div
        style={{ maxHeight: `${maxDim}px` }}
        className="aspect-square h-full
      border-2 border-t-transparent border-[color:--loading-color] 
      rounded-full animate-spin"
      ></div>
    </div>
  );
};
