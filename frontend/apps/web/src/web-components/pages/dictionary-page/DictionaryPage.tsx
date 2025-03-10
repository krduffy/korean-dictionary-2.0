import { usePersistentDictionaryPageStateContext } from "@repo/shared/contexts/PersistentDictionaryPageStateContext";
import { useResponsiveness } from "./useResponsiveness";
import { Panel } from "../../panel/Panel";
import { PageWithNavBar } from "../navbar/PageWithNavBar";

export const DictionaryPage = () => {
  const { leftPanelData, rightPanelData } =
    usePersistentDictionaryPageStateContext();
  const { twoPanelsAllowed } = useResponsiveness({ window: window });

  const leftPanelVisible = leftPanelData.state.visible;
  const rightPanelVisible = rightPanelData.state.visible;

  const makeLeftVisible = () =>
    leftPanelData.panelDispatchStateChangeSelf({ type: "make_visible" });
  const makeRightVisible = () =>
    rightPanelData.panelDispatchStateChangeSelf({ type: "make_visible" });

  /**
   * If two panels not allowed then only show the left panel / its panel toggler.
   * Else show left and right depending on visibility.
   */

  const leftPanel = <Panel {...leftPanelData} />;

  const rightPanel = <Panel {...rightPanelData} />;

  /* Case where two not allowed; only show left */
  if (!twoPanelsAllowed) {
    /* If attempt to dispatch a view in the other panel then refuse and alert */

    /* If this is needed at some point in the future it can be readded but is
       not useful atm */

    //const overrideDispatchInOtherPanel = () => {
    //  alert("Cannot dispatch in other panel");
    //};

    return (
      <PageWithNavBar>
        {leftPanelVisible ? (
          <div className="h-full w-full">{leftPanel}</div>
        ) : (
          <div className="h-full w-full flex items-center justify-center p-4">
            <SetPanelVisibleButton
              forWhichPanel="left"
              onAdd={makeLeftVisible}
            />
          </div>
        )}
      </PageWithNavBar>
    );
  }

  /* Neither panel visible. */
  if (!leftPanelVisible && !rightPanelVisible) {
    return (
      <PageWithNavBar>
        <div className="h-full grid grid-cols-2 p-4">
          <div className="col-span-1 flex items-center justify-center">
            <SetPanelVisibleButton
              forWhichPanel="left"
              onAdd={makeLeftVisible}
            />
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <SetPanelVisibleButton
              forWhichPanel="right"
              onAdd={makeRightVisible}
            />
          </div>
        </div>
      </PageWithNavBar>
    );
  }

  /* Left only. */
  if (leftPanelVisible && !rightPanelVisible) {
    return (
      <PageWithNavBar>
        <div className="h-full grid grid-cols-10 p-4">
          <div className="col-start-2 col-end-10 bg-background h-full overflow-hidden">
            {/* LEFT PANEL */}
            {leftPanel}
          </div>
          <div className="col-start-10 col-end-11 flex items-center justify-center">
            <SetPanelVisibleButton
              forWhichPanel="right"
              onAdd={makeRightVisible}
            />
          </div>
        </div>
      </PageWithNavBar>
    );
  }

  /* Right only. */
  if (!leftPanelVisible && rightPanelVisible) {
    return (
      <PageWithNavBar>
        <div className="h-full grid grid-cols-10 p-4">
          <div className="col-start-1 col-end-2 flex items-center justify-center">
            <SetPanelVisibleButton
              forWhichPanel="left"
              onAdd={makeLeftVisible}
            />
          </div>
          <div className="col-start-2 col-end-10 h-full overflow-hidden">
            {/* RIGHT PANEL */}
            {rightPanel}
          </div>
        </div>
      </PageWithNavBar>
    );
  }

  /* Both panels are visible. */
  return (
    <PageWithNavBar>
      {/* Text is made a bit smaller since two panels are being shown */}
      <div className="h-full grid grid-cols-2 p-4">
        <div className="col-span-1 mr-2 h-full overflow-hidden">
          {/* LEFT PANEL */}
          {leftPanel}
        </div>
        <div className="col-span-1 ml-2 h-full overflow-hidden">
          {/* RIGHT PANEL */}
          {rightPanel}
        </div>
      </div>
    </PageWithNavBar>
  );
};

const SetPanelVisibleButton = ({
  forWhichPanel,
  onAdd,
}: {
  forWhichPanel: "left" | "right";
  onAdd: () => void;
}) => {
  return (
    <button
      data-testid={`make-${forWhichPanel}-panel-visible-button`}
      onClick={onAdd}
      title="새로운 사전창을 열기"
      className="w-12 h-12 rounded-full bg-[color:--button-color] flex 
      items-center justify-center hover:bg-[color:--button-hover-color] 
      transition-colors"
    >
      <span className="text-3xl text-[color:--button-text-color] leading-none">
        +
      </span>
    </button>
  );
};

export default DictionaryPage;
