"use client";

import { useState, FC } from "react";
import { Calendar } from "@nextui-org/calendar";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";

export interface CustomDatePickerProps {
    handleChange?: (date: CalendarDate | null) => void;
    currDate?: CalendarDate | null;
}

const CustomDatePicker: FC<CustomDatePickerProps> = ({ handleChange, currDate }) => {
  const [date, setDate] = useState(currDate ? currDate :today(getLocalTimeZone()));

  return (
    <div>
      <Calendar
        className="rounded-3xl"
        aria-label="Date (Controlled)"
        value={date}
        onChange={(date) => {
          setDate(date);
          handleChange && handleChange(date);
        }}
        minValue={today(getLocalTimeZone())}
        calendarWidth={350}
        visibleMonths={1}
        weekdayStyle="short"
        classNames={{
          content: "rounded-3xl",
          nextButton: "text-grey-800 hover:text-primary-500 text-lg primary-focus",
          prevButton: "text-grey-800 hover:text-primary-500 text-lg",
          gridHeaderCell: "text-xs text-grey-600 p-5",
          title: "text-neutral-800 font-semibold",
          headerWrapper: "pt-5",
          gridWrapper: "bg-white pb-5",
          gridBody: "bg-white",
          cellButton: "data-[selected]:bg-primary-500 data-[selected]:text-white hover:bg-gray-100 text-sm p-5",
        }}
      />
    </div>
  );
};

export default CustomDatePicker;
