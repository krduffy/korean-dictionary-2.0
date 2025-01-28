import { HanjaDetailView, HanjaSearchView } from "./hanjaViewTypes";
import {
  FindLemmaView,
  KoreanDetailView,
  KoreanSearchView,
} from "./koreanViewTypes";
import { PanelHomepageView } from "./panelHomepageViewTypes";
import {
  DerivedExampleTextDetailView,
  DerivedExampleTextEojeolNumLemmasView,
} from "./userExampleViewTypes";

export type View =
  | PanelHomepageView
  | KoreanSearchView
  | KoreanDetailView
  | HanjaSearchView
  | HanjaDetailView
  | FindLemmaView
  | DerivedExampleTextDetailView
  | DerivedExampleTextEojeolNumLemmasView;
