"use client";

import React, { useState } from "react";
import { FC } from "react";
import { useEffect } from "react";
import ClearDataButton from "@/shared/ClearDataButton";
import { useRef } from "react";
import useOutsideClick from "@/hooks/useOutsideClick";
import { MapPinIcon } from "@heroicons/react/24/outline";
// import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";

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

  const testLocation = ["Ha Noi, Viet Nam", "Ho Chi Minh, Viet Nam", "Da Nang, Viet Nam", "Hue, Viet Nam"];
  const renderSearchValue = () => {
    return (
      <>
        {testLocation.map((item) => (
          <span
            onClick={() => handleSelectLocation(item)}
            key={item}
            className="flex px-4 sm:px-6 items-center space-x-3 py-4 hover:bg-neutral-100 cursor-pointer">
            <span className="block text-neutral-400">
              <MapPinIcon className="h-4 w-4 sm:h-6 sm:w-6" />
            </span>
            <span className="block text-neutral-700">{item}</span>
          </span>
        ))}
      </>
    );
  };

  return (
    <div className={`relative flex ${className}`} ref={containerRef}>
      <div
        onClick={() => setShowPopover(true)}
        className={`flex flex-1 relative z-10 [ nc-Header-field-padding--small ] flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left ${
          showPopover ? "nc-Header-field-focused--2" : ""
        }`}>
        <div className="flex-1">
          <input
            className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-400 xl:text-base font-semibold placeholder-neutral-800 truncate`}
            placeholder={placeHolder}
            value={value}
            autoFocus={showPopover}
            onChange={(e) => setValue(e.currentTarget.value)}
            ref={inputRef}
          />
          <span className="block mt-0.5 text-sm text-neutral-400 font-light ">
            <span className="line-clamp-1">{!!value ? placeHolder : desc}</span>
          </span>
          {value && showPopover && <ClearDataButton onClick={() => setValue("")} />}
        </div>
      </div>

      {showPopover && (
        <div
          className={`h-8 absolute self-center top-1/2 -translate-y-1/2 z-0 bg-white ${""}`}></div>
      )}

      {showPopover && (
        <div className="absolute left-0 z-40 w-full min-w-[300px] sm:min-w-[400px] bg-white top-full mt-3 py-3 sm:py-5 rounded-3xl shadow-xl max-h-96 overflow-y-auto">
          {renderSearchValue()}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
