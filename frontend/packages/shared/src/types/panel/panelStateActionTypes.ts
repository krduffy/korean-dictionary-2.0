import { NotViewScopedActionType } from "./panel-state-action-types/notViewScopedActionTypes";
import { PushActionType } from "./panel-state-action-types/pushActionTypes";
import { UpdateInteractionDataActionType } from "./panel-state-action-types/updateInteractionDataActionTypes";

export type PanelStateAction =
  | NotViewScopedActionType
  | PushActionType
  | UpdateInteractionDataActionType;
