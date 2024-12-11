/* Goal is for changes in data from api to detect when the user invalidates a previous
   result that is being stored in the cache or being displayed on another panel in the
   case of there being more than one panel
   eg
   Left panel: search 'apple'
   Right panel: search 'apple'
   In left panel, set first result to known
   => When this is done, cache should detect that one of its entries is outdated
      and update it (without refetching). The right panel should also detect that its data being
      displayed is outdated and rerender after getting new data from cache */

import { useRef } from "react";
import {
  APIDataChangeListenerData,
  APIDataChangeNotificationData,
  UseAPIDataChangeManagerReturns,
} from "../../types/apiDataChangeEventTypes";

/* consumers need to be able to specify that they want to observe changes only to
   korean/hanja (way in which pk provided should be interpreted),
   type of change (options:
      KNOWN
      STUDIED
      + eventually examples, pictures
   )
 */

export const useAPIDataChangeManager = (): UseAPIDataChangeManagerReturns => {
  /* Korean words have number pks; hanja chars have string pks */
  const listeners = useRef<Map<number | string, APIDataChangeListenerData[]>>(
    new Map()
  );

  /**
   *
   * Subscribes a consumer to api data change events. !! The subscribed consumer must also
   * call unsubscribe to avoid memory leaks !!
   *
   * @param pk The primary key to observe changes in. `number`s are generally for korean words,
   *           while `string`s are generally for hanja characters.
   * @param listenerData The data to provide for the listener.
   */
  const subscribe = (
    pk: number | string,
    listenerData: APIDataChangeListenerData
  ) => {
    const prevListenersForPk = listeners.current.get(pk);

    if (prevListenersForPk === undefined) {
      listeners.current.set(pk, [listenerData]);
    } else {
      prevListenersForPk.push(listenerData);
    }
  };

  /**
   * A function to unsubscribe from notifications. Listeners with matching
   * `pk` and `listenerData` will be removed. For `listenerData`, referential equality
   * determines which listeners are considered matching.
   *
   * @param pk - The pk of the listener(s) to remove.
   * @param listenerData - The listener data of the listener(s) to remove.
   */
  const unsubscribe = (
    pk: number | string,
    listenerData: APIDataChangeListenerData
  ) => {
    const prevListenersForPk = listeners.current.get(pk);

    if (prevListenersForPk !== undefined) {
      listeners.current.set(
        pk,
        prevListenersForPk.filter((ld) => ld !== listenerData)
      );
    }
  };

  /**
   * Emits an api data change event to relevant subscribers, calling their listener
   * callback functions.
   *
   * @param pk The primary key that subscribers must have provided to receive this notification.
   * @param notificationData The data for this notification.
   */
  const emit = (
    pk: number | string,
    notificationData: APIDataChangeNotificationData
  ) => {
    listeners.current.get(pk)?.forEach((listenerData) => {
      if (listenerData.eventType === notificationData.eventType) {
        listenerData.onNotification(notificationData.passToCallback);
      }
    });
  };

  return {
    subscribe,
    unsubscribe,
    emit,
  };
};
