export const TextAreaInput = ({
  id,
  rows,
  cols,
  value,
  onChange,
}: {
  id: string;
  rows: number;
  cols: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  return (
    <textarea
      className="resize-none flex-1 rounded-lg p-2 border-2 
               border-[color:--accent-border-color] 
               focus:border-[color:--focus-blue]
               bg-[color:--neutral-color-not-hovering]
               hover:bg-[color:--neutral-color-hovering] 
               focus:bg-[color:--neutral-color-hovering]
               transition-all"
      id={id}
      rows={rows}
      cols={cols}
      value={value}
      onChange={onChange}
    />
  );
};
