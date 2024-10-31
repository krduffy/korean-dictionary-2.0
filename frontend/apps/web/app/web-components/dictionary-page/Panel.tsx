import React from "react";
import "./styles.css";
import { Homepage } from "./Homepage";

export const Panel = ({ onClose }) => {
  return (
    <div>
      <Homepage />
      <CloseButton onClose={onClose} />
    </div>
  );
};

const CloseButton = ({ onClose }) => {
  return <button onClick={onClose}>to close</button>;
};
