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

  const apiBusy = useRef<boolean>(false);
  const onSuccess = useRef<((response: APIResponseType) => void) | undefined>(
    undefined
  );

  useEffect(() => {
    if (requestState.progress === "error") {
      sendNotification(<ErrorMessage error={requestState.response} />, 4000);
    } else if (requestState.progress === "success") {
      sendNotification(<SuccessMessage message="" />, 4000);
      onSuccess.current?.(requestState.response);
      onSuccess.current = undefined;
    }

    if (requestState.progress === "loading") {
      apiBusy.current = true;
    } else {
      setTimeout(() => {
        apiBusy.current = false;
      }, 4000);
    }
  }, [requestState]);

  const sendAPIBusyMessage = () => {
    sendNotification(
      <SimpleNotification>
        이전 수정이 아직 완료되지 않아 수정할 수 없습니다.
      </SimpleNotification>,
      2000
    );
  };

  const addNewItem = async () => {
    if (apiBusy.current) {
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

    const formData = new FormData();
    for (const [k, v] of Object.entries(itemToSave)) {
      formData.append(k, v);
    }

    onSuccess.current = (response: APIResponseType) =>
      setListOfDataItems(
        // The api must return the data for the created object (that contains
        // the id so the item can be deleted).
        // @ts-ignore
        listOfDataItems.with(index, response)
      );

    callAPI(dataForOperation.url, {
      method: dataForOperation.method,
      body: formData,
    });
  };

  const deleteItemByIndex = async (index: number) => {
    if (apiBusy.current) {
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

    onSuccess.current = () => {
      setListOfDataItems(listOfDataItems.toSpliced(index, 1));
    };

    callAPI(deleteUrl, { method: "DELETE" });
  };

  return {
    addNewItem,
    saveItemByIndex,
    deleteItemByIndex,
  };
};
