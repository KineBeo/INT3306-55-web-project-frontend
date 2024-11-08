"use client";

import { useState, FC } from "react";
import { RangeCalendar } from "@nextui-org/calendar";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";

export interface CustomRangeDatePickerProps {
  handleChange?: (start: CalendarDate | null, end: CalendarDate | null) => void;
  currRange?: { start: CalendarDate | null; end: CalendarDate | null };
}

const CustomRangeDatePicker: FC<CustomRangeDatePickerProps> = ({ handleChange, currRange }) => {
  const [value, setValue] = useState(
    currRange
      ? currRange
      : {
          start: today(getLocalTimeZone()),
          end: today(getLocalTimeZone()).add({ weeks: 1 }),
        }
  );

  return (
    <div>
      <RangeCalendar
        className="rounded-3xl"
        aria-label="Date (Controlled)"
        value={{
          start: value.start || today(getLocalTimeZone()),
          end: value.end || today(getLocalTimeZone()).add({ weeks: 1 }),
        }}
        onChange={(value) => {
          setValue(value);
          handleChange && handleChange(value.start, value.end);
        }}
        minValue={today(getLocalTimeZone())}
        calendarWidth={350}
        visibleMonths={1}
        weekdayStyle="short"
        classNames={{
          content: "rounded-3xl",
          nextButton: "text-grey-800 hover:text-primary-6000 text-lg primary-focus",
          prevButton: "text-grey-800 hover:text-primary-6000 text-lg",
          gridHeaderCell: "text-xs text-grey-600 p-5",
          title: "text-gray-800 font-semibold",
          headerWrapper: "pt-5",
          gridWrapper: "bg-white pb-5",
          gridBody: "bg-white",
          cellButton:
            "data-[selection-start]:bg-primary-6000 data-[selection-end]:bg-primary-6000 data-[selection-start]:text-white data-[selection-end]:text-white hover:bg-gray-100 text-sm p-5",
        }}
      />
    </div>
  );
};

export default CustomRangeDatePicker;
