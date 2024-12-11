export type UseAPIDataChangeManagerReturns = {
  subscribe: (
    // eslint-disable-next-line no-unused-vars
    pk: number | string,
    // eslint-disable-next-line no-unused-vars
    listenerData: APIDataChangeListenerData
  ) => void;
  unsubscribe: (
    // eslint-disable-next-line no-unused-vars
    pk: number | string,
    // eslint-disable-next-line no-unused-vars
    listenerData: APIDataChangeListenerData
  ) => void;
  emit: (
    // eslint-disable-next-line no-unused-vars
    pk: number | string,
    // eslint-disable-next-line no-unused-vars
    notificationData: APIDataChangeNotificationData
  ) => void;
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

export type APIDataChangeListenerData =
  | APIDataChangeKnownChangedListenerData
  | APIDataChangeStudiedChangedListenerData;
export type APIDataChangeNotificationData =
  | APIDataChangeKnownChangedNotificationData
  | APIDataChangeStudiedChangedNotificationData;
