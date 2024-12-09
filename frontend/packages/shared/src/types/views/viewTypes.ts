import { HanjaDetailView, HanjaSearchView } from "./hanjaViewTypes";
import {
  FindLemmaView,
  KoreanDetailView,
  KoreanSearchView,
} from "./koreanViewTypes";

export type View =
  | KoreanSearchView
  | HanjaSearchView
  | KoreanDetailView
  | HanjaDetailView
  | FindLemmaView;
