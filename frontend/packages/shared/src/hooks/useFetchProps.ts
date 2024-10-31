"use client";

import { useState, useEffect } from "react";
import { UseCallAPIReturns } from "../types/apiCallTypes";

export const useFetchProps = ({
  invokedUseCallAPI,
}: {
  invokedUseCallAPI: UseCallAPIReturns;
}) => {
  const [props, setProps] = useState({});

  const { successful, error, loading, response, callAPI } = invokedUseCallAPI;

  useEffect(() => {
    const get = async () => {
      await callAPI();

      if (successful) {
        setProps(response);
      }
    };

    get();
    /* DEPENDENCY ARRAY WILL NEED TO CHANGE SO THAT WHEN USER LOGS IN ETC THE APP KNOWS
       IF THE CURRENT VIEW NEEDS TO BE UPDATED!!!!!!!! */
  }, []);

  return {
    successful,
    error,
    loading,
    response,
    props,
  };
};
