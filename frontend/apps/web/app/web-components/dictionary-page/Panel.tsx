import React from "react";
import "./styles.css";
import { Homepage } from "./Homepage";
import { usePanel } from "@repo/shared/hooks/usePanel";
import { KoreanSearchView } from "./KoreanSearchView";

export const Panel = ({ initialView, onClose }) => {
  const { view } = usePanel({ initialView: initialView });

  return (
    <div>
      <Homepage />
      <CloseButton onClose={onClose} />
      <MainContent view={view} />
    </div>
  );
};

const CloseButton = ({ onClose }) => {
  return <button onClick={onClose}>to close</button>;
};

const MainContent = ({ view }) => {
  if (view.type === "korean_search") {
    return <KoreanSearchView />;
  }

  return <div>Unknown view.</div>;
};
