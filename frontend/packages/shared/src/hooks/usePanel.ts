import { useState } from "react";
import { View } from "../types/viewTypes";

export const usePanel = ({ initialView }: { initialView: View }) => {
  const [view, setView] = useState(initialView);

  return {
    view,
  };
};
