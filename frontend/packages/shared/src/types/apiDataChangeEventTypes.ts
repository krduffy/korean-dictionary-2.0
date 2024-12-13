import { ValidPkFieldType } from "./views/dictionary-items/sharedTypes";

export type SubscribeFnType = (
  // eslint-disable-next-line no-unused-vars
  pk: ValidPkFieldType,
  // eslint-disable-next-line no-unused-vars
  listenerData: APIDataChangeListenerData<APIDataChangeEventType>
) => void;

export type UnsubscribeFnType = (
  // eslint-disable-next-line no-unused-vars
  pk: ValidPkFieldType,
  // eslint-disable-next-line no-unused-vars
  listenerData: APIDataChangeListenerData<APIDataChangeEventType>
) => void;

export type EmitFnType = (
  // eslint-disable-next-line no-unused-vars
  pk: ValidPkFieldType,
  // eslint-disable-next-line no-unused-vars
  notificationData: APIDataChangeNotificationData<APIDataChangeEventType>
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
  // eslint-disable-next-line no-unused-vars
  onNotification: (passToCallback: CallbackParam) => void;
}

export interface BaseAPIDataChangeNotificationData<
  EventType extends string,
  CallbackParam,
> {
  eventType: EventType;
  passToCallback: CallbackParam;
}

export type CallbackParamMappings = {
  knownChanged: boolean;
  studiedChanged: boolean;
  loadedDataChanged: void;
};

export type APIDataChangeEventType = keyof CallbackParamMappings;

export type APIDataChangeListenerData<T extends APIDataChangeEventType> =
  BaseAPIDataChangeListenerData<T, CallbackParamMappings[T]>;

export type APIDataChangeNotificationData<
  T extends keyof CallbackParamMappings,
> = BaseAPIDataChangeNotificationData<T, CallbackParamMappings[T]>;

export type SavedSubscriptionArguments<T extends APIDataChangeEventType> = {
  pk: ValidPkFieldType;
  listenerData: APIDataChangeListenerData<T>;
};
