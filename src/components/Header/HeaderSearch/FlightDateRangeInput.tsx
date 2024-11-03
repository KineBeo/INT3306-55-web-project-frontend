"use client";

import React, { Fragment, useState } from "react";
import { FC } from "react";
import { Popover, Transition } from "@headlessui/react";
import ClearDataButton from "@/shared/ClearDataButton";
import ButtonSubmit from "@/shared/ButtonSubmit";

export interface FlightDateRangeInputProps {
  className?: string;
  fieldClassName?: string;
  hasButtonSubmit?: boolean;
  selectsRange?: boolean;
}

const FlightDateRangeInput: FC<FlightDateRangeInputProps> = ({
  className = "",
  fieldClassName = "[ nc-hero-field-padding--small ]",
  hasButtonSubmit = true,
  selectsRange = true,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(
    new Date()
  );
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

  return (
    <>
      <Popover className={`FlightDateRangeInput relative flex ${className}`}>
        {({ open }) => (
          <>
            <div
              className={`flex-1 z-10 flex items-center focus:outline-none ${
                open ? "nc-hero-field-focused--2" : ""
              }`}
            >
              <Popover.Button
                className={`flex-1 z-10 flex relative ${fieldClassName} items-center space-x-3 focus:outline-none `}
              >
                {renderInput()}

                {startDate && open && (
                  <ClearDataButton
                    onClick={() => onChangeRangeDate([null, null])}
                  />
                )}
              </Popover.Button>

              {/*Submit Button*/}
              {hasButtonSubmit && (
                <div className="pr-2 xl:pr-4">
                  <ButtonSubmit href="#" />
                </div>
              )}
            </div>
          </>
        )}
      </Popover>
    </>
  );
};

export default FlightDateRangeInput;
