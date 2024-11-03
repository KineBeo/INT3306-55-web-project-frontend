"use client";

import React, { FC, useState, useEffect } from "react";
import SearchForm from "./SearchForm";

export type SearchTab = "Book" | "Manage Booking" | "Online Check-in";

export interface HeaderSearchProps {
  className?: string;
  defaultTab?: SearchTab;
  onTabChange?: (tab: SearchTab) => void;
}
const TABS: SearchTab[] = ["Book", "Manage Booking", "Online Check-in"];

const HeaderSearch: FC<HeaderSearchProps> = ({ className = "", defaultTab = "Book", onTabChange }) => {
  const [tabActive, setTabActive] = useState<SearchTab>(defaultTab);

  useEffect(() => {
    setTabActive(defaultTab);
  }, [defaultTab]);

  const renderTab = () => {
    return (
      <ul className="h-[88px] flex justify-center space-x-5 sm:space-x-9">
        {TABS.map((tab) => {
          const active = tab === tabActive;
          return (
            <li
              onClick={() => {
                setTabActive(tab);
                onTabChange && onTabChange(tab);
              }}
              className={`relative flex-shrink-0 flex items-center cursor-pointer text-base ${
                active
                  ? "text-neutral-900 dark:text-neutral-200 font-medium"
                  : "text-neutral-500 dark:text-neutral-300 "
              } `}
              key={tab}>
              <div className="relative select-none">
                <span>{tab}</span>
                {active && (
                  <span className="absolute top-full mt-1 block w-full h-0.5 rounded-full bg-neutral-800 dark:bg-neutral-100 mr-2" />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderForm = () => {
    return <SearchForm />;
  };

  return (
    <div className={`nc-HeaderSearchFormSmall ${className}`} data-nc-id="HeaderSearchFormSmall">
      {renderTab()}
      <div className="mt-2">{renderForm()}</div>
    </div>
  );
};

export default HeaderSearch;
