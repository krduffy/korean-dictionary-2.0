import {SearchBarConfig} from "../views/searchConfigTypes";
import { View } from "../views/viewTypes";

export interface PanelState {
  visible: boolean;
  searchConfig:SearchBarConfig
  view: View;
  historyData: HistoryData;
}

export interface SpecificPanelState<
  ViewType extends View,
  SearchConfigType extendsSearchBarConfig
> extends PanelState {
  searchConfig: SearchConfigType;
  view: ViewType;
}

export type HistoryData = {
  views: View[];
  pointer: number;
  maxLength: number;
};
