export type SubscribeFnType = (
  // eslint-disable-next-line no-unused-vars
  pk: number | string,
  // eslint-disable-next-line no-unused-vars
  listenerData: APIDataChangeListenerData
) => void;

export type UnsubscribeFnType = (
  // eslint-disable-next-line no-unused-vars
  pk: number | string,
  // eslint-disable-next-line no-unused-vars
  listenerData: APIDataChangeListenerData
) => void;

export type EmitFnType = (
  // eslint-disable-next-line no-unused-vars
  pk: number | string,
  // eslint-disable-next-line no-unused-vars
  notificationData: APIDataChangeNotificationData
) => void;

export type UseAPIDataChangeManagerReturns = {
  subscribe: SubscribeFnType;
  unsubscribe: UnsubscribeFnType;
  emit: EmitFnType;
};

export interface APIDataChangeKnownChangedListenerData {
  eventType: "known";
  // eslint-disable-next-line no-unused-vars
  onNotification: (newKnown: boolean) => void;
}

export interface APIDataChangeKnownChangedNotificationData {
  eventType: "known";
  passToCallback: boolean;
}

export interface APIDataChangeStudiedChangedListenerData {
  eventType: "studied";
  // eslint-disable-next-line no-unused-vars
  onNotification: (newStudied: boolean) => void;
}

export interface APIDataChangeStudiedChangedNotificationData {
  eventType: "studied";
  passToCallback: boolean;
}

export interface APIDataChangeLoadedDataChangedListenerData {
  eventType: "loadedDataChanged";
  onNotification: () => void;
}

export interface APIDataChangeLoadedDataChangedNotificationData {
  eventType: "loadedDataChanged";
  passToCallback: void;
}

export type APIDataChangeListenerData =
  | APIDataChangeKnownChangedListenerData
  | APIDataChangeStudiedChangedListenerData
  | APIDataChangeLoadedDataChangedListenerData;
export type APIDataChangeNotificationData =
  | APIDataChangeKnownChangedNotificationData
  | APIDataChangeStudiedChangedNotificationData
  | APIDataChangeLoadedDataChangedNotificationData;

export type SavedSubscriptionArguments = {
  pk: number | string;
  listenerData: APIDataChangeListenerData;
};
