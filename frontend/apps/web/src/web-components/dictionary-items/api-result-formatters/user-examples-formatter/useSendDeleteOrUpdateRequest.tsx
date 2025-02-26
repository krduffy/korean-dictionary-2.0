import { useUserExamplesContext } from "../../api-fetchers/user-examples/UserExamplesContextProvider";
import { useNotificationContext } from "@repo/shared/contexts/NotificationContextProvider";
import {
  UserExampleSentenceType,
  UserImageExampleType,
  UserVideoExampleType,
} from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { getUserExampleEndpoint } from "@repo/shared/utils/apiAliases";
import { useEffect, useRef } from "react";
import { useCallAPIWeb } from "../../../../shared-web-hooks/useCallAPIWeb";
import { SimpleNotification } from "../../../pages/notifications/SimpleNotification";
import { ErrorMessage } from "../../../text-formatters/messages/ErrorMessage";
import { SuccessMessage } from "../../../text-formatters/messages/SuccessMessage";
import { APIResponseType } from "@repo/shared/types/apiCallTypes";

export const useSendDeleteOrUpdateRequest = <
  DataType extends
    | UserExampleSentenceType
    | UserVideoExampleType
    | UserImageExampleType,
>({
  listOfDataItems,
  setListOfDataItems,
}: {
  listOfDataItems: Omit<DataType, "id">[];
  setListOfDataItems: React.Dispatch<
    React.SetStateAction<Omit<DataType, "id">[]>
  >;
}) => {
  const { sendNotification } = useNotificationContext();

  const { emptyDataTypeTemplate, type, headwordTargetCode } =
    useUserExamplesContext();
  const { callAPI, requestState } = useCallAPIWeb({ cacheResults: false });

  useEffect(() => {
    if (requestState.progress === "error") {
      sendNotification(<ErrorMessage error={requestState.response} />, 4000);
    } else if (requestState.progress === "success") {
      sendNotification(<SuccessMessage message="성공했습니다." />, 4000);
    }
  }, [requestState]);

  const sendAPIBusyMessage = () => {
    sendNotification(<SimpleNotification>cant send</SimpleNotification>, 2000);
  };

  const addNewItem = async () => {
    if (requestState.progress === "loading") {
      sendAPIBusyMessage();
      return;
    }

    // @ts-ignore
    setListOfDataItems([...listOfDataItems, emptyDataTypeTemplate]);
  };

  const saveItemByIndex = async (index: number) => {
    if (requestState.progress === "loading") {
      sendAPIBusyMessage();
      return;
    }

    const itemToSave = listOfDataItems[index];

    if (itemToSave === undefined) return;

    // @ts-ignore
    const creatingNew = itemToSave.id === undefined;

    const dataForOperation = creatingNew
      ? {
          url: getUserExampleEndpoint({
            exampleType: type,
            headwordTargetCode: headwordTargetCode,
          }),
          method: "POST",
        }
      : {
          url: getUserExampleEndpoint({
            exampleType: type,
            headwordTargetCode: headwordTargetCode,
            // @ts-ignore it's a number
            exampleItemPk: itemToSave.id,
          }),
          method: "PATCH",
        };

    callAPI(dataForOperation.url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: dataForOperation.method,
      body: JSON.stringify(itemToSave),
    }).then((response: APIResponseType) => {
      if (creatingNew && requestState.progress === "success" && response) {
        setListOfDataItems(
          listOfDataItems.with(index, {
            ...itemToSave,
            id: response.id,
          })
        );
      }
    });
  };

  const deleteItemByIndex = async (index: number) => {
    if (requestState.progress === "loading") {
      sendAPIBusyMessage();
      return;
    }

    // is undefined or number. if id exists then the item actually exists
    // in the database already. if it does not exist on the listed data item,
    // then it was added via `addNewItem` but not yet saved. in the case that it
    // is not in the database, no request needs to be sent.
    const itemToDelete = listOfDataItems[index];

    if (itemToDelete === undefined) return;

    // @ts-ignore
    if (itemToDelete.id === undefined) {
      setListOfDataItems(listOfDataItems.toSpliced(index, 1));
      return;
    }

    const deleteUrl = getUserExampleEndpoint({
      exampleType: type,
      headwordTargetCode: headwordTargetCode,
      // @ts-ignore (it's a number)
      exampleItemPk: itemToDelete.id,
    });

    callAPI(deleteUrl, { method: "DELETE" }).then(
      (response: APIResponseType) => {
        if (requestState.progress === "success" && response) {
          setListOfDataItems(listOfDataItems.splice(index, 1));
        }
      }
    );
  };

  return {
    addNewItem,
    saveItemByIndex,
    deleteItemByIndex,
  };
};
