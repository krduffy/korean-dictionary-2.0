"use client";
import { KoreanSearchView } from "./views/KoreanSearchView";
import { SearchBarArea } from "./search-bar-area/SearchBarArea";

import {
  PanelState,
  PanelStateAction,
  View,
} from "@repo/shared/types/panelAndViewTypes";
import { HanjaSearchView } from "./views/HanjaSearchView";
import { KoreanDetailView } from "./views/KoreanDetailView";
import { HanjaDetailView } from "./views/HanjaDetailView";
import { HistoryNavigationArea } from "./HistoryNavigationArea";
import { ViewDispatchersContextProvider } from "app/web-contexts/ViewDispatchersContext";

interface PanelProps {
  state: PanelState;
  dispatch: React.Dispatch<PanelStateAction>;
  dispatchInOtherPanel: React.Dispatch<PanelStateAction>;
}

export const Panel = ({
  state,
  dispatch,
  dispatchInOtherPanel,
}: PanelProps) => {
  return (
    <ViewDispatchersContextProvider
      dispatch={dispatch}
      dispatchInOtherPanel={dispatchInOtherPanel}
    >
      <div
        className="h-full bg-[color:--background-secondary] text-[color:--text-secondary] p-4 
    rounded-2xl
    shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
    border border-gray-200/20
    backdrop-blur-[12px]
    hover:shadow-[0_8px_35px_rgb(0,0,0,0.16)]
    transition-shadow duration-300
    saturate-[1.02]
"
      >
        <div className="flex flex-row">
          <div className="w-[80%]">
            <SearchBarArea
              searchConfig={state.searchConfig}
              dispatch={dispatch}
            />
          </div>
          <div className="w-[20%]">
            <CloseButton onClose={() => dispatch({ type: "make_invisible" })} />
            <HistoryNavigationArea dispatch={dispatch} />
          </div>
        </div>
        <div className="">
          <MainContent view={state.view} />
        </div>
      </div>
    </ViewDispatchersContextProvider>
  );
};

const CloseButton = ({ onClose }: { onClose: () => void }) => {
  return <button onClick={onClose}>to close</button>;
};

const MainContent = ({ view }: { view: View }) => {
  /* To improve change detection the data objects are split up here */
  if (view.type === "korean_search") {
    return <KoreanSearchView searchConfig={view.data} />;
  }

  if (view.type === "hanja_search") {
    return (
      /* things here need to be converted to strings */
      <HanjaSearchView searchConfig={view.data} />
    );
  }

  if (view.type === "korean_detail") {
    return <KoreanDetailView target_code={view.data.target_code} />;
  }

  if (view.type === "hanja_detail") {
    return <HanjaDetailView character={view.data.character} />;
  }

  return <div>Unknown view.</div>;
};
