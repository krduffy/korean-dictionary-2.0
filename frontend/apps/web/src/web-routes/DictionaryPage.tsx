import { usePersistentDictionaryPageStateContext } from "../web-contexts/PersistentDictionaryPageStateContext";
import { PageWithNavBar } from "../web-components/navbar/PageWithNavBar";
import { Panel } from "../web-components/dictionary-page/Panel";
import { useResponsiveness } from "../web-hooks/useResponsiveness";

export const DictionaryPage = () => {
  const { leftPanelData, rightPanelData } =
    usePersistentDictionaryPageStateContext();
  const { twoPanelsAllowed } = useResponsiveness();

  const leftPanelVisible = leftPanelData.state.visible;
  const rightPanelVisible = rightPanelData.state.visible;

  const makeLeftVisible = () =>
    leftPanelData.dispatch({ type: "make_visible" });
  const makeRightVisible = () =>
    rightPanelData.dispatch({ type: "make_visible" });

  /**
   * If two panels not allowed then only show the left panel / its panel toggler.
   * Else show left and right depending on visibility.
   */

  /* Case where two not allowed; only show left */
  if (!twoPanelsAllowed) {
    /* If attempt to dispatch a view in the other panel then refuse and alert */
    const overrideDispatchInOtherPanel = () => {
      alert("Cannot dispatch in other panel");
    };

    return (
      <PageWithNavBar>
        {leftPanelVisible ? (
          <div className="h-full w-full">
            <Panel
              state={leftPanelData.state}
              dispatch={leftPanelData.dispatch}
              dispatchInOtherPanel={overrideDispatchInOtherPanel}
            />
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center p-4">
            <PanelToggler onAdd={makeLeftVisible} />
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
            <PanelToggler onAdd={makeLeftVisible} />
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <PanelToggler onAdd={makeRightVisible} />
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
            <Panel
              state={leftPanelData.state}
              dispatch={leftPanelData.dispatch}
              dispatchInOtherPanel={leftPanelData.dispatchInOtherPanel}
            />
          </div>
          <div className="col-start-10 col-end-11 flex items-center justify-center">
            <PanelToggler onAdd={makeRightVisible} />
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
            <PanelToggler onAdd={makeLeftVisible} />
          </div>
          <div className="col-start-2 col-end-10 h-full overflow-hidden">
            {/* RIGHT PANEL */}
            <Panel
              state={rightPanelData.state}
              dispatch={rightPanelData.dispatch}
              dispatchInOtherPanel={rightPanelData.dispatchInOtherPanel}
            />
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
          <Panel
            state={leftPanelData.state}
            dispatch={leftPanelData.dispatch}
            dispatchInOtherPanel={leftPanelData.dispatchInOtherPanel}
          />
        </div>
        <div className="col-span-1 ml-2 h-full overflow-hidden">
          {/* RIGHT PANEL */}
          <Panel
            state={rightPanelData.state}
            dispatch={rightPanelData.dispatch}
            dispatchInOtherPanel={rightPanelData.dispatchInOtherPanel}
          />
        </div>
      </div>
    </PageWithNavBar>
  );
};

const PanelToggler = ({ onAdd }: { onAdd: () => void }) => {
  return (
    <button
      onClick={onAdd}
      title="새로운 사전창을 열기"
      className="w-12 h-12 rounded-full bg-[color:--button-color] flex 
      items-center justify-center hover:bg-[color:--button-hover-color] 
      transition-colors"
    >
      <span className="text-3xl text-[color:--text-primary]-600 leading-none">
        +
      </span>
    </button>
  );
};

export default DictionaryPage;
