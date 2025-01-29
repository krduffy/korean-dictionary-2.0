import { SearchBarConfig } from "../views/searchConfigTypes";
import { View } from "../views/viewTypes";

export interface PanelState {
  visible: boolean;
  searchConfig: SearchBarConfig;
  viewAndScrollDistance: ViewAndScrollDistance;
  historyData: HistoryData;
}

export interface ViewAndScrollDistance {
  view: View;
  scrollDistance: number;
}

export type HistoryData = {
  viewsAndScrollDistances: ViewAndScrollDistance[];
  pointer: number;
  maxLength: number;
};
