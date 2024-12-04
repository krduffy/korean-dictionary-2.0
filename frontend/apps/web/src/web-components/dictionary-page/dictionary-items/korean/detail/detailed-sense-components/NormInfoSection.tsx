import { StringWithNLPAndHanja } from "../../../../../other/string-formatters/StringWithNLP";
import { NormType } from "@repo/shared/types/dictionaryItemProps";

export const NormInfoSection = ({ norms }: { norms: NormType[] }) => {
  return (
    <ul>
      {norms.map((norm, id, array) => (
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
