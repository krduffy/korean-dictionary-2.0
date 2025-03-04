export const SimpleCheckboxControl = ({
  value,
  setter,
}: {
  value: boolean;
  setter: (newValue: boolean) => void;
}) => {
  return (
    <div className="min-w-8 flex-none flex justify-center items-center">
      <input
        type="checkbox"
        className=""
        checked={value}
        onChange={() => setter(!value)}
      ></input>
    </div>
  );
};
