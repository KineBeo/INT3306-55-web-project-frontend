"use client";

import React, { useState, useRef, useEffect } from "react";
import { FC } from "react";
import CustomRangeDatePicker from "@/components/CustomRangeDatePicker";
import CustomDatePicker from "@/components/CustomDatePicker";
import useOutsideClick from "@/hooks/useOutsideClick";
import { CalendarDate } from "@nextui-org/calendar";
import ClearDataButton from "@/shared/ClearDataButton";

export interface FlightDateRangeInputProps {
  className?: string;
  selectsRange?: boolean;
}

const FlightDateRangeInput: FC<FlightDateRangeInputProps> = ({ className = "", selectsRange = true }) => {
  const [startDate, setStartDate] = useState<CalendarDate | null>(null);
  const [endDate, setEndDate] = useState<CalendarDate | null>(null);

  const onChangeRangeDate = (start: CalendarDate | null, end: CalendarDate | null) => {
    if (!start || !end) return;
    setStartDate(start);
    setEndDate(end);
  };

  const onChangeDate = (date: CalendarDate | null) => {
    if (!date) return;
    setStartDate(date);
  };

  const clearData = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [showPopover, setShowPopover] = useState(false);

  useOutsideClick(containerRef, () => {
    setShowPopover(false);
  });

  useEffect(() => {
    if (showPopover && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPopover]);

  const renderInput = () => {
    return (
        <div className="flex-1 flex lg:flex-col">
          <span className="flex-1 lg:order-0 order-1 text-right lg:text-left w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-400 text-xs md:text-base font-semibold placeholder-neutral-800 truncate">
            {startDate
              ? new Date(startDate.year, startDate.month - 1, startDate.day).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                })
              : "Add Dates"}
            {selectsRange && endDate
              ? " - " +
                new Date(endDate.year, endDate.month - 1, endDate.day).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                })
              : ""}
          </span>
          <span className="lg:order-1 order-0 mt-0.5 text-xs md:text-sm text-neutral-400 font-light">
            {selectsRange ? "Pick up - Drop off" : "Pick up date"}
          </span>
        </div>
    );
  };

  return (
    <>
      <div className={`relative flex flex-col ${className}`} ref={containerRef}>
        <div
          onClick={() => setShowPopover(!showPopover)}
          className={`flex flex-1 relative z-10 [ nc-Header-field-padding--small ] flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left rounded-full border-1 lg:border-0 border-neutral-200 ${
            showPopover ? "nc-Header-field-focused--2" : ""
          }`}>
          <div className="flex-1 flex items-center">
            {renderInput()}
            {startDate && showPopover && <ClearDataButton onClick={clearData} />}
          </div>
        </div>
        {showPopover && (
          <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:text-center text-right z-40 top-full mt-3">
            {selectsRange ? (
              <CustomRangeDatePicker handleChange={onChangeRangeDate} currRange={{ start: startDate, end: endDate }} />
            ) : (
              <CustomDatePicker handleChange={onChangeDate} currDate={startDate} />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default FlightDateRangeInput;
