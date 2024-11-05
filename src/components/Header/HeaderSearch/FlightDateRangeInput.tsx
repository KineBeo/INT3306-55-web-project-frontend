"use client";

import React, { Fragment, useRef, useState } from "react";
import { FC } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import ClearDataButton from "@/shared/ClearDataButton";
import { today, getLocalTimeZone } from "@internationalized/date";
import { RangeCalendar } from "@nextui-org/calendar";

export interface FlightDateRangeInputProps {
  className?: string;
  selectsRange?: boolean;
}

const FlightDateRangeInput: FC<FlightDateRangeInputProps> = ({ className = "", selectsRange = true }) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const onChangeRangeDate = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const renderInput = () => {
    return (
      <>
        <div className="flex-grow text-left">
          <span className="block xl:text-base font-semibold">
            {startDate?.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
            }) || "Add dates"}
            {selectsRange && endDate
              ? " - " +
                endDate?.toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                })
              : ""}
          </span>
          <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
            {selectsRange ? "Pick up - Drop off" : "Pick up date"}
          </span>
        </div>
      </>
    );
  };
  //flex flex-1 relative z-10 [ nc-Header-field-padding--small ] flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left ${
  //   showPopover ? "nc-Header-field-focused--2" : ""
  const ref = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className={`relative flex ${className}`}>
        <div
          className={`flex flex-1 relative z-10 [ nc-Header-field-padding--small ] flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left ${isOpen ? "nc-Header-field-focused--2" : ""}`}>
          <div className="flex-1 z-10 flex relative items-center space-x-3 focus:outline-none">
            {renderInput()}
            {startDate && isOpen && <ClearDataButton onClick={() => onChangeRangeDate([null, null])} />}
          </div>
        </div>
        {isOpen && (
          <div className="h-8 absolute self-center top-1/2 -translate-y-1/2 z-0 -left-0.5 right-10 bg-white"></div>
        )}
      </div>
      {/* <RangeCalendar
          className="nextui-range-calendar"
      aria-label="Date (Min Date Value)"
      minValue={today(getLocalTimeZone())}
    /> */}
    </>
  );
};

export default FlightDateRangeInput;
