import { HanjaDetailView, HanjaSearchView } from "./hanjaViewTypes";
import {
  FindLemmaView,
  KoreanDetailView,
  KoreanSearchView,
} from "./koreanViewTypes";
import { PanelHomepageView } from "./panelHomepageViewTypes";
import {
  AddDerivedExampleTextView,
  DerivedExampleTextDetailView,
  DerivedExampleTextEojeolNumLemmasView,
  KoreanUserExampleEditView,
  ListedDerivedExampleTextsView,
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
  | DerivedExampleTextEojeolNumLemmasView
  | ListedDerivedExampleTextsView
  | AddDerivedExampleTextView;
