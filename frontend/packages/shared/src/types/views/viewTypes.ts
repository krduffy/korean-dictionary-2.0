import { HanjaDetailView, HanjaSearchView } from "./hanjaViewTypes";
import {
  FindLemmaView,
  KoreanDetailView,
  KoreanSearchView,
} from "./koreanViewTypes";
import { PanelHomepageView } from "./panelHomepageViewTypes";
import { DerivedExampleTextDetailView } from "./userExampleViewTypes";

export type View =
  | PanelHomepageView
  | KoreanSearchView
  | HanjaSearchView
  | KoreanDetailView
  | HanjaDetailView
  | FindLemmaView
  | DerivedExampleTextDetailView;
