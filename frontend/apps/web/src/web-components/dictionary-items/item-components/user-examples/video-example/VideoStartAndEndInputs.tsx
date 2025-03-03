import { UserVideoExampleType } from "@repo/shared/types/views/dictionary-items/userExampleItems";
import { useId, useRef } from "react";
import { NumberInput } from "../../../../forms/input-components/NumberInput";
import { useWidthObserver } from "../../../../../shared-web-hooks/useWidthObserver";

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
  const gridRef = useRef<HTMLDivElement | null>(null);
  const { belowCutoff } = useWidthObserver({ ref: gridRef, cutoff: 400 });

  /* if the area is too narrow then it is not a grid; it instead changes it to
     flex-col which invalidates the classes on all the start and end labels + inputs */
  const gridClass = belowCutoff
    ? "flex flex-col gap-2 justify-center items-center"
    : "grid place-items-center gap-2";
  const startLabelClass = "row-start-1 row-span-1 col-start-1 col-span-1";
  const startInputClass = "row-start-1 row-span-1 col-start-2 col-span-1";
  const endLabelClass = "row-start-2 row-span-1 col-start-1 col-span-1";
  const endInputClass = "row-start-2 row-span-1 col-start-2 col-span-1";

  return (
    <div ref={gridRef} className={gridClass}>
      <div className={startLabelClass}>해당 부분 시작</div>
      <div className={startInputClass}>
        <HoursMinutesSecondsInput
          time={start}
          changeFieldApplied={(newValue: number) =>
            changeField<"start">("start", newValue)
          }
        />
      </div>

      <div className={endLabelClass}>해당 부분 끝</div>
      <div className={endInputClass}>
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
    (baseSeconds: number, scalar: number) => (newValue: number) =>
      changeFieldApplied(baseSeconds + scalar * newValue);

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
    <div className="flex flex-row gap-1 items-center">
      <NumberInput
        id={id}
        min={0}
        max={60}
        value={displayedValue}
        onChange={deleteNonnumericBeforeChange}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};
