import { useEffect } from "react";
import {
  JsonObjectType,
  RequestConfig,
  UseCallAPIReturns,
} from "../../types/apiCallTypes";

export type UsePropFormArgs = {
  url: string;
  formDataGetter: () => JsonObjectType;
  useCallAPIInstance: UseCallAPIReturns;
  repostDependencies: any[];
};

/* 'Prop form' refers to requests that are pretty much get requests but instead are
   post requests. ie find lemma request, which is a post request */

export const usePropForm = ({
  url,
  formDataGetter,
  useCallAPIInstance,
  repostDependencies,
}: UsePropFormArgs) => {
  const { requestState, callAPI } = useCallAPIInstance;

  const doPost = async () => {
    const config: RequestConfig = {
      method: "POST",
      body: JSON.stringify(formDataGetter()),
      headers: {
        "Content-Type": "application/json",
      },
    };

    return await callAPI(url, config);
  };

  useEffect(() => {
    doPost();
  }, repostDependencies);

  return {
    requestState,
  };
};
