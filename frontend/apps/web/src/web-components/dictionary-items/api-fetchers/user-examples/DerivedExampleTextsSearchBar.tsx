import { useEffect, useRef, useState } from "react";

export const DerivedExampleTextsSearchBar = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (newSearchTerm: string) => void;
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const updateRealSearchTerm = () => {
      setSearchTerm(localSearchTerm);
    };

    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    inactivityTimer.current = setTimeout(updateRealSearchTerm, 500);
  }, [localSearchTerm]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLocalSearchTerm(e.target.value);

  return (
    <input
      type="search"
      placeholder="문서 출처 검색어 입력해주세요"
      value={localSearchTerm}
      onChange={onChange}
      className="h-12 w-full px-4 py-2 
            bg-[color:--neutral-color-not-hovering]
            border border-[color:--border-color]
            rounded-full
            outline-none text-[color:--text-primary]
            focus:ring-2 focus:border-[color:--focus-blue]
            hover:bg-[color:--neutral-color-hovering]
            transition-all duration-200
            "
    />
  );
};
