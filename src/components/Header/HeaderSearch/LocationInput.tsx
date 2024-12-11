"use client";

import React, { useState, useEffect, useRef } from "react";
import { FC } from "react";
import ClearDataButton from "@/shared/ClearDataButton";
import useOutsideClick from "@/hooks/useOutsideClick";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "@/redux/hooks";

export interface LocationInputProps {
  onInputDone?: (value: string) => void;
  placeHolder?: string;
  desc?: string;
  className?: string;
  autoFocus?: boolean;
}

const LocationInput: FC<LocationInputProps> = ({
  autoFocus = false,
  onInputDone,
  placeHolder = "Location",
  desc = "Where?",
  className = "nc-flex-1.5",
}) => {
  const { airports } = useAppSelector((state) => state.airport);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState("");
  const [showPopover, setShowPopover] = useState(autoFocus);

  useEffect(() => {
    setShowPopover(autoFocus);

    const timeoutId = setTimeout(() => {
      if (autoFocus && inputRef.current) {
        inputRef.current.focus();
      }
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [autoFocus]);

  useOutsideClick(containerRef, () => {
    setShowPopover(false);
  });

  useEffect(() => {
    if (showPopover && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPopover]);

  const handleSelectLocation = (item: string) => {
    setValue(item);

    if (onInputDone) {
      onInputDone(item);
    }

    setShowPopover(false);
  };

  const filteredAirports = airports.filter((airport) => {
    const searchValue = value.toLowerCase();
    return (
      airport.name.toLowerCase().includes(searchValue) ||
      airport.city.toLowerCase().includes(searchValue) ||
      airport.country.toLowerCase().includes(searchValue)
    );
  });

  const renderSearchValue = () => {
    return (
      <>
        {filteredAirports.map((airport) => (
          <div className="flex px-2 sm:px-4 items-center space-x-3 py-2 md:py-4 hover:bg-neutral-100 cursor-pointer" key={airport.id} onClick={() => handleSelectLocation(airport.name)}>
            <span className="block text-neutral-400 md:text-base text-xs">
              <MapPinIcon className="h-4 w-4 sm:h-6 sm:w-6" />
            </span>
            <div className="flex-1 flex flex-col">
              <span             
                className="">
                <span className="block text-neutral-700">{airport.name}</span>
              </span>
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className={`relative flex flex-col ${className}`} ref={containerRef}>
      <div
        onClick={() => setShowPopover(!showPopover)}
        className={`flex flex-1 relative z-10 [ nc-Header-field-padding--small ] flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left rounded-full border-1 lg:border-0 border-neutral-200 ${
          showPopover ? "nc-Header-field-focused--2" : ""
        }`}>
        <div className="flex-1 flex items-center">
          <div className="flex-1 flex lg:flex-col">
            <input
              className={`flex-1 lg:order-0 order-1 text-right lg:text-left w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-400 text-xs md:text-base font-semibold placeholder-neutral-800 truncate`}
              placeholder={placeHolder}
              value={value}
              autoFocus={showPopover}
              onChange={(e) => setValue(e.currentTarget.value)}
              ref={inputRef}
            />
            <span className="lg:order-1 order-0 mt-0.5 text-xs md:text-sm text-neutral-400 font-light ">
              <span className="line-clamp-1">{!!value ? placeHolder : desc}</span>
            </span>
          </div>
          {value && showPopover && <ClearDataButton onClick={() => setValue("")} />}
        </div>
      </div>

      {showPopover && (
        <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 z-40 w-full min-w-[300px] bg-white top-full mt-3 py-3 rounded-3xl border-1 border-neutral-200 shadow-xl max-h-96 overflow-y-auto">
          {renderSearchValue()}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
