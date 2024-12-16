"use client";

import React, { useState, useEffect, useRef } from "react";
import { FC } from "react";
import useOutsideClick from "@/hooks/useOutsideClick";

export interface LocationInputProps {
  onInputDone?: (value: string) => void;
  dataList?: string[];
  required?: boolean;
  disabled?: boolean;
  placeHolder?: string;
  defaultValue?: string;
  name?: string;
  classNames?: {
    input?: string;
    suggestion?: string;
  };
  autoFocus?: boolean;
}

const SuggestionInput: FC<LocationInputProps> = ({
  autoFocus = false,
  required = false,
  disabled = false,
  onInputDone,
  dataList = [],
  defaultValue = "",
  placeHolder = "",
  name = "",
  classNames = {
    input: "",
    suggestion: "",
  },
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null); // Thêm ref để cuộn danh sách

  const [value, setValue] = useState(defaultValue);
  const [showPopover, setShowPopover] = useState(autoFocus);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

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

  const handleSelect = (item: string) => {
    setValue(item);

    if (onInputDone) {
      onInputDone(item);
    }

    setShowPopover(false);
    setHighlightedIndex(null);
  };

  const filteredData = dataList.filter((data) => {
    const searchValue = value.toLowerCase();
    return data.toLowerCase().includes(searchValue);
  });

  const renderSearchValue = () => {
    return (
      <div className="overflow-y-auto max-h-48" ref={listRef}>
        {filteredData.map((data, index) => (
          <div
            className={`flex px-4 items-center py-3 hover:bg-neutral-100 cursor-pointer ${
              index < filteredData.length - 1 ? "border-b-2 border-neutral-100" : ""
            } ${highlightedIndex === index ? "bg-neutral-200" : ""}`}
            key={index}
            onClick={() => handleSelect(data)}>
            <span className="text-neutral-600 text-sm truncate text-nowrap">{data}</span>
          </div>
        ))}
      </div>
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      if (highlightedIndex === null) {
        setHighlightedIndex(0);
      } else if (highlightedIndex < filteredData.length - 1) {
        setHighlightedIndex(highlightedIndex + 1);
      }
    } else if (e.key === "ArrowUp") {
      if (highlightedIndex !== null && highlightedIndex > 0) {
        setHighlightedIndex(highlightedIndex - 1);
      }
    } else if (e.key === "Enter" && highlightedIndex !== null) {
      const selectedAirport = filteredData[highlightedIndex];
      handleSelect(selectedAirport);
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
    <div className={`relative flex flex-col`} ref={containerRef}>
      <div
        className={`flex flex-1 relative z-10 flex-shrink-0 items-center cursor-pointer focus:outline-none text-left ${
          showPopover ? "nc-Header-field-focused--2" : ""
        }`}>
        <input
          className={`${classNames.input} ${disabled ? "cursor-not-allowed text-neutral-400" : ""}`}
          placeholder={placeHolder}
          name={name}
          required={required}
          disabled={disabled}
          value={value || ""}
          autoFocus={showPopover}
          onChange={(e) => setValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowPopover(true)}
          ref={inputRef}
        />
      </div>

      {showPopover && (
        <div className="relative left-1/2 -translate-x-1/2 z-40 w-full bg-white top-full mt-3 py-3 rounded-xl border-1 border-neutral-200 shadow-xl max-h-56">
          {renderSearchValue()}
        </div>
      )}
    </div>
  );
};

export default SuggestionInput;
