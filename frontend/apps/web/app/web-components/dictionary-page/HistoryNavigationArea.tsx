import { PanelStateAction } from "@repo/shared/types/panelAndViewTypes";

export const HistoryNavigationArea = ({
  dispatch,
}: {
  dispatch: React.Dispatch<PanelStateAction>;
}) => {
  return (
    <div>
      <NavigateBackButton onClick={() => dispatch({ type: "navigate_back" })} />
      <NavigateForwardButton
        onClick={() => dispatch({ type: "navigate_forward" })}
      />
    </div>
  );
};

const NavigateBackButton = ({ onClick }) => {
  return <button onClick={onClick}>back</button>;
};

const NavigateForwardButton = ({ onClick }) => {
  return <button onClick={onClick}>forward</button>;
};
