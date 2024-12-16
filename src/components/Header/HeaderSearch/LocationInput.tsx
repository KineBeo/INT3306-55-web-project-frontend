"use client";

import React, { useState, useEffect, useRef } from "react";
import { FC } from "react";
import ClearDataButton from "@/shared/ClearDataButton";
import useOutsideClick from "@/hooks/useOutsideClick";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "@/redux/hooks";
import { Airport } from "@/data/airport";

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
  const listRef = useRef<HTMLDivElement>(null); // Thêm ref để cuộn danh sách

  const [value, setValue] = useState("");
  const [showPopover, setShowPopover] = useState(autoFocus);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [isInvalid, setIsInvalid] = useState(false);

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

  const handleSelectLocation = (item: Airport) => {
    setValue(item.name);

    if (onInputDone) {
      onInputDone(item.code);
    }

    setShowPopover(false);
    setHighlightedIndex(null);
    setIsInvalid(false);
  };

  const filteredAirports = airports.filter((airport) => {
    const searchValue = value.toLowerCase();
    return (
      airport.code.toLowerCase().includes(searchValue) ||
      airport.name.toLowerCase().includes(searchValue) ||
      airport.city.toLowerCase().includes(searchValue) ||
      airport.country.toLowerCase().includes(searchValue)
    );
  });

  const renderSearchValue = () => {
    return (
      <div className="overflow-y-auto max-h-[360px]" ref={listRef}>
        {filteredAirports.map((airport, index) => (
          <div
            className={`flex px-4 items-center space-x-3 py-2 md:py-4 hover:bg-neutral-100 cursor-pointer ${
              index < filteredAirports.length - 1 ? "border-b-2 border-neutral-100" : ""
            } ${highlightedIndex === index ? "bg-neutral-200" : ""}`}
            key={airport.id}
            onClick={() => handleSelectLocation(airport)}>
            <span className="block text-neutral-400 md:text-base text-xs">
              <MapPinIcon className="h-4 w-4 sm:h-6 sm:w-6" />
            </span>
            <div className="flex-1 flex flex-col">
              <span className="text-neutral-400 text-xs">{airport.name}</span>
              <span className="text-neutral-700 text-sm">
                ({airport.code}) - {airport.city}, {airport.country}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      if (highlightedIndex === null) {
        setHighlightedIndex(0);
      } else if (highlightedIndex < filteredAirports.length - 1) {
        setHighlightedIndex(highlightedIndex + 1);
      }
    } else if (e.key === "ArrowUp") {
      if (highlightedIndex !== null && highlightedIndex > 0) {
        setHighlightedIndex(highlightedIndex - 1);
      }
    } else if (e.key === "Enter" && highlightedIndex !== null) {
      const selectedAirport = filteredAirports[highlightedIndex];
      handleSelectLocation(selectedAirport);
    } else {
      setShowPopover(true);
    }
  };

  useEffect(() => {
    if (highlightedIndex !== null && listRef.current) {
      const listElement = listRef.current;
      const highlightedElement = listElement.children[highlightedIndex] as HTMLElement;

      // Kiểm tra nếu mục được chọn đang ngoài tầm nhìn, và cuộn nó vào
      if (highlightedElement) {
        const elementTop = highlightedElement.offsetTop;
        const elementBottom = elementTop + highlightedElement.offsetHeight;
        const listTop = listElement.scrollTop;
        const listBottom = listTop + listElement.clientHeight;

        if (elementTop < listTop) {
          listElement.scrollTop = elementTop; // Cuộn lên
        } else if (elementBottom > listBottom) {
          listElement.scrollTop = elementBottom - listElement.clientHeight; // Cuộn xuống
        }
      }
    }
  }, [highlightedIndex]);

  return (
    <div className={`relative flex flex-col ${className}`} ref={containerRef}>
      <div
        onClick={() => {
          setShowPopover(true);
          inputRef.current?.focus();
        }}
        onKeyDown={(e) => e.key === "Tab" && setShowPopover(false)}
        className={`flex flex-1 relative z-10 [ nc-Header-field-padding--small ] flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left rounded-full border-1 lg:border-0 border-neutral-200 ${
          showPopover ? "nc-Header-field-focused--2" : ""
        } ${isInvalid ? "nc-Input-inValid" : ""}`}>
        <div className="flex-1 flex items-center">
          <div className="flex-1 flex lg:flex-col">
            <input
              className={`flex-1 lg:order-0 order-1 text-right lg:text-left w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-400 text-xs md:text-base font-semibold placeholder-neutral-800 truncate`}
              placeholder={placeHolder}
              value={value}
              onInvalid={(e) => {
                e.preventDefault();
                setIsInvalid(true);
              }}
              required
              autoFocus={showPopover}
              onChange={(e) => setValue(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowPopover(true)}
              ref={inputRef}
            />
            <span className="lg:order-1 order-0 mt-0.5 text-xs md:text-sm text-neutral-400 font-light ">
              <span className="line-clamp-1">{!!value ? placeHolder : desc}</span>
            </span>
          </div>
          {value && <ClearDataButton onClick={() => setValue("")} />}
        </div>
      </div>

      {showPopover && (
        <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 z-40 w-full min-w-[320px] bg-white top-full mt-3 py-3 rounded-3xl border-1 border-neutral-200 shadow-xl max-h-96">
          {renderSearchValue()}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
