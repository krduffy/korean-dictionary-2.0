import { UserVideoExampleType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { useId } from "react";

export const VideoStartAndEndInputs = ({
  start,
  end,
  changeField,
}: {
  start: number;
  end: number;
  changeField: <Field extends keyof UserVideoExampleType>(
    field: Field,
    newValue: UserVideoExampleType[Field]
  ) => void;
}) => {
  return (
    <div className="grid place-items-center gap-2">
      <div className="row-start-1 row-span-1 col-start-1 col-span-1">
        해당 부분 시작
      </div>
      <div className="row-start-1 row-span-1 col-start-2 col-span-1">
        <HoursMinutesSecondsInput
          time={start}
          changeFieldApplied={(newValue: number) =>
            changeField<"start">("start", newValue)
          }
        />
      </div>

      <div className="row-start-2 row-span-1 col-start-1 col-span-1">
        해당 부분 끝
      </div>
      <div className="row-start-2 row-span-1 col-start-2 col-span-1">
        <HoursMinutesSecondsInput
          time={end}
          changeFieldApplied={(newValue: number) =>
            changeField<"end">("end", newValue)
          }
        />
      </div>
    </div>
  );
};

const HoursMinutesSecondsInput = ({
  time,
  changeFieldApplied,
}: {
  time: number;
  changeFieldApplied: (newValue: number) => void;
}) => {
  let timeRemaining = time;

  const hours = Math.floor(timeRemaining / 3600);
  timeRemaining -= hours * 3600;
  const minutes = Math.floor(timeRemaining / 60);
  timeRemaining -= minutes * 60;
  const seconds = timeRemaining;

  const getOnChangeFunction =
    (baseSeconds: number, scalar: number) => (newValue: number) => {
      console.table([baseSeconds, scalar, newValue]);
      changeFieldApplied(baseSeconds + scalar * newValue);
    };

  return (
    <div className="flex flex-row gap-2">
      <TimeInputLabelAndBox
        label="시간"
        displayedValue={hours}
        onChange={getOnChangeFunction(seconds + minutes * 60, 3600)}
      />
      <TimeInputLabelAndBox
        label="분"
        displayedValue={minutes}
        onChange={getOnChangeFunction(seconds + hours * 3600, 60)}
      />
      <TimeInputLabelAndBox
        label="초"
        displayedValue={seconds}
        onChange={getOnChangeFunction(minutes * 60 + hours * 3600, 1)}
      />
    </div>
  );
};

const TimeInputLabelAndBox = ({
  label,
  displayedValue,
  onChange,
}: {
  label: string;
  displayedValue: number;
  onChange: (newValue: number) => void;
}) => {
  const deleteNonnumericBeforeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    const intFromString = parseInt(e.target.value.replace(/[^\d]/g, ""));
    const registeredNumber =
      typeof intFromString === "number" && !isNaN(intFromString)
        ? intFromString
        : 0;

    onChange(registeredNumber);
  };

  const id = useId();

  return (
    <div className="flex flex-row gap-1">
      <input
        id={id}
        type="number"
        min={0}
        max={60}
        value={displayedValue}
        onChange={deleteNonnumericBeforeChange}
      />{" "}
      <label htmlFor={id}>{label}</label>
    </div>
  );
};
