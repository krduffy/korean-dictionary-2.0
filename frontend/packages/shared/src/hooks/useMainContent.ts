import { useEffect, useState } from "react";
import { View } from "../types/panelAndViewTypes";

export const useMainContent = ({ view }: { view: View }) => {
  const [rrndr, setRrndr] = useState<number>(0);

  useEffect(() => {
    setRrndr((x) => x + 1);
  }, [JSON.stringify(view)]);
};
