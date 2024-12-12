import { ValidPkFieldType } from "./views/dictionary-items/sharedTypes";

export type SubscribeFnType = (
  // eslint-disable-next-line no-unused-vars
  pk: ValidPkFieldType,
  // eslint-disable-next-line no-unused-vars
  listenerData: APIDataChangeListenerData
) => void;

export type UnsubscribeFnType = (
  // eslint-disable-next-line no-unused-vars
  pk: ValidPkFieldType,
  // eslint-disable-next-line no-unused-vars
  listenerData: APIDataChangeListenerData
) => void;

export type EmitFnType = (
  // eslint-disable-next-line no-unused-vars
  pk: ValidPkFieldType,
  // eslint-disable-next-line no-unused-vars
  notificationData: APIDataChangeNotificationData
) => void;

export type UseAPIDataChangeManagerReturns = {
  subscribe: SubscribeFnType;
  unsubscribe: UnsubscribeFnType;
  emit: EmitFnType;
};

export interface BaseAPIDataChangeListenerData<
  EventType extends string,
  CallbackParam,
> {
  eventType: EventType;
  onNotification: (passToCallback: CallbackParam) => void;
}

export interface BaseAPIDataChangeNotificationData<
  EventType extends string,
  CallbackParam,
> {
  eventType: EventType;
  passToCallback: CallbackParam;
}

export type APIDataChangeKnownChangedListenerData =
  BaseAPIDataChangeListenerData<"known", boolean>;
export type APIDataChangeKnownChangedNotificationData =
  BaseAPIDataChangeNotificationData<"known", boolean>;

export type APIDataChangeStudiedChangedListenerData =
  BaseAPIDataChangeListenerData<"studied", boolean>;
export type APIDataChangeStudiedChangedNotificationData =
  BaseAPIDataChangeNotificationData<"studied", boolean>;

export type APIDataChangeLoadedDataChangedListenerData =
  BaseAPIDataChangeListenerData<"loadedDataChanged", void>;
export type APIDataChangeLoadedDataChangedNotificationData =
  BaseAPIDataChangeNotificationData<"loadedDataChanged", void>;

export type CacheFacingAPIDataChangeListenerData =
  | APIDataChangeKnownChangedListenerData
  | APIDataChangeStudiedChangedListenerData;

export type CacheFacingAPIDataChangeNotificationData =
  | APIDataChangeKnownChangedNotificationData
  | APIDataChangeStudiedChangedNotificationData;

export type APIDataChangeListenerData =
  | CacheFacingAPIDataChangeListenerData
  | APIDataChangeLoadedDataChangedListenerData;
export type APIDataChangeNotificationData =
  | CacheFacingAPIDataChangeNotificationData
  | APIDataChangeLoadedDataChangedNotificationData;

export type SavedSubscriptionArguments = {
  pk: number | string;
  listenerData: APIDataChangeListenerData;
};
