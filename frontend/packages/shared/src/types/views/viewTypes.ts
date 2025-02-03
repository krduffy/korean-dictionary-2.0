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
  KoreanUserExampleEditView,
} from "./userExampleViewTypes";

export type View =
  | PanelHomepageView
  | KoreanSearchView
  | KoreanDetailView
  | KoreanUserExampleEditView
  | HanjaSearchView
  | HanjaDetailView
  | FindLemmaView
  | DerivedExampleTextDetailView
  | DerivedExampleTextEojeolNumLemmasView;
