import {
  JsonArrayType,
  JsonDataType,
  JsonObjectType,
  JsonPrimitiveType,
} from "@repo/shared/types/apiCallTypes";
import { Fragment } from "react";

const TAB_WIDTH = 4;

const getNullSpan = () => {
  return <span>null</span>;
};

const getArrayDiv = (array: JsonArrayType, depth: number) => {
  return (
    <Fragment>
      {"["}
      {array.map((jsonDataItem, id) => (
        <div key={id} style={{ whiteSpace: "pre" }}>
          {"\t".repeat(depth)}
          {prettifyJson(jsonDataItem, depth + 1)}
        </div>
      ))}
      {"]"}
    </Fragment>
  );
};

const getObjectDiv = (object: JsonObjectType, depth: number) => {
  return (
    <Fragment>
      {"{"}
      {Object.entries(object).map(([k, v], id) => (
        <div key={id} style={{ whiteSpace: "pre" }}>
          {"\t".repeat(depth)}
          {k}: {prettifyJson(v, depth + 1)},
        </div>
      ))}
      {"}"}
    </Fragment>
  );
};

const getPrimitiveSpan = (primitive: JsonPrimitiveType) => {
  return (
    <span>{typeof primitive === "string" ? `"${primitive}"` : primitive}</span>
  );
};

export const prettifyJson = (jsonStructure: JsonDataType, depth: number) => {
  if (jsonStructure === null) {
    return getNullSpan();
  } else if (Array.isArray(jsonStructure)) {
    return getArrayDiv(jsonStructure, depth + 1);
  } else if (typeof jsonStructure === "object") {
    return getObjectDiv(jsonStructure, depth + 1);
  } else {
    return getPrimitiveSpan(jsonStructure);
  }
};
