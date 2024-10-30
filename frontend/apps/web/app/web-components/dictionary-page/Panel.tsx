import React from "react";
import "./styles.css";

export const Panel = ({ onClose }) => {
  return (
    <div>
      <CloseButton onClose={onClose} />
    </div>
  );
};

const CloseButton = ({ onClose }) => {
  return <button onClick={onClose}>to close</button>;
};
