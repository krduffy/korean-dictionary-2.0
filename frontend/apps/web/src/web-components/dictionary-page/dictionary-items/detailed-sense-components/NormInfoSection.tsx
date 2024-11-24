import { StringWithNLPAndHanja } from "../../../other/string-formatters/StringWithNLP";
import { NormInfoType } from "@repo/shared/types/dictionaryItemProps.js";

export const SenseNormInfo = ({ normInfo }: { normInfo: NormInfoType }) => {
  return (
    <ul>
      {normInfo.map((norm, id, array) => (
        <li
          key={id}
          style={{
            paddingBottom: id != array.length - 1 ? "20px" : "",
          }}
        >
          <div style={{ paddingBottom: "5px" }}>
            <span className="word-emphasized-box">{norm.type}</span>
            {norm.role && (
              <span>
                {" "}
                <StringWithNLPAndHanja string={norm.role} />
              </span>
            )}
          </div>
          {norm.desc && (
            <div>
              → <StringWithNLPAndHanja string={norm.desc} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};
