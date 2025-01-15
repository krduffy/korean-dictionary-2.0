import { HanjaDetailView, HanjaSearchView } from "./hanjaViewTypes";
import {
  FindLemmaView,
  KoreanDetailView,
  KoreanSearchView,
} from "./koreanViewTypes";
import { PanelHomepageView } from "./panelHomepageViewTypes";

export type View =
  | PanelHomepageView
  | KoreanSearchView
  | HanjaSearchView
  | KoreanDetailView
  | HanjaDetailView
  | FindLemmaView;
