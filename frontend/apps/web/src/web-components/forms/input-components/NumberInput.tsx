export const NumberInput = ({
  id,
  min,
  max,
  value,
  onChange,
}: {
  id: string;
  min: number;
  max: number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <input
      className="rounded-lg p-2 border-2 
               border-[color:--accent-border-color] 
               focus:border-[color:--focus-blue]
               bg-[color:--neutral-color-not-hovering]
               hover:bg-[color:--neutral-color-hovering] 
               focus:bg-[color:--neutral-color-hovering]
               transition-all"
      id={id}
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
    />
  );
};
