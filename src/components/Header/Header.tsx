"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import Logo from "@/shared/Logo";
import useOutsideAlerter from "@/hooks/useOutsideClick";
import NotifyDropdown from "@/components/NotificationDropdown";
import SignInButton from "@/shared/SignInButton";
import MenuBar from "@/shared/MenuBar";
import { usePathname } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import HeaderSearch from "./HeaderSearch/HeaderSearch";
import Image from "next/image";
import flightTakeOff from "@/images/flight-takeoff.svg";
import flightRoster from "@/images/flight-roster.svg";
import flightTicket from "@/images/flight-ticket.svg";
import { set } from "react-datepicker/dist/date_utils";

interface HeaderProps {
  className?: string;
}

let WIN_PREV_POSITION = 0;
if (typeof window !== "undefined") {
  WIN_PREV_POSITION = (window as any).pageYOffset;
}

const Header: FC<HeaderProps> = ({ className = "" }) => {
  const headerInnerRef = useRef<HTMLDivElement>(null);

  const [showHeaderSearch, setShowHeaderSearch] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<"Book" | "Manage Booking" | "Online Check-in">("Book");

  useOutsideAlerter(headerInnerRef, () => {
    setShowHeaderSearch(false);
    setCurrentTab("Book");
  });

  let pathname = usePathname();

  useEffect(() => {
    setShowHeaderSearch(false);
  }, [pathname]);

  // handle scroll event
  useEffect(() => {
    window.addEventListener("scroll", handleEvent);
    return () => {
      window.removeEventListener("scroll", handleEvent);
    };
  }, []);

  const handleEvent = () => {
    window.requestAnimationFrame(handleHideHeaderSearch);
  };

  const handleHideHeaderSearch = () => {
    if (!document.querySelector("#nc-Header-anchor")) {
      return;
    }

    let currentScrollPos = window.pageYOffset;
    if (WIN_PREV_POSITION - currentScrollPos > 100 || WIN_PREV_POSITION - currentScrollPos < -100) {
      setShowHeaderSearch(false);
    } else {
      return;
    }
    WIN_PREV_POSITION = currentScrollPos;
  };

  const renderHeaderSearch = () => {
    return (
      <div
        className={`absolute inset-x-0 top-0 transition-all will-change-[transform,opacity] ${
          showHeaderSearch
            ? "visible"
            : "-translate-x-0 -translate-y-[90px] scale-x-[0.395] scale-y-[0.6] opacity-0 invisible pointer-events-none"
        }`}>
        <div className={`w-full max-w-4xl mx-auto pb-6`}>
          <HeaderSearch defaultTab={currentTab} onTabChange={setCurrentTab} />
        </div>
      </div>
    );
  };

  const renderHeaderSearchBar = () => {
    return (
      <div
        className={`w-full relative flex items-center justify-between border border-neutral-200 dark:border-neutral-6000 rounded-full shadow hover:shadow-md transition-all ${
          showHeaderSearch
            ? "-translate-x-0 translate-y-20 scale-x-[2.55] scale-y-[1.8] opacity-0 pointer-events-none invisible"
            : "visible"
        }`}>
        <div className="flex items-center font-medium text-sm">
          <div className="flex items-center cursor-pointer" onClick={() => setShowHeaderSearch(true)}>
            <Image src={flightTakeOff} alt="airplane" className="w-5 h-5 ml-5" />
            <span className="block pl-2 pr-4 py-3">Book</span>
          </div>

          <span className="h-5 w-[1px] bg-neutral-300 dark:bg-neutral-700"></span>

          <div className="flex items-center cursor-pointer" onClick={() => setShowHeaderSearch(false)}>
            <Image src={flightRoster} alt="airplane" className="w-5 h-5 ml-4" />
            <span
              onClick={() => {
                setShowHeaderSearch(false);
                // open manage booking
              }}
              className="block pl-2 pr-4 cursor-pointer py-3 ">
              Manage Booking
            </span>
          </div>

          <span className="h-5 w-[1px] bg-neutral-300 dark:bg-neutral-700"></span>

          <div className="flex items-center cursor-pointer" onClick={() => setShowHeaderSearch(false)}>
            <Image src={flightTicket} alt="airplane" className="w-5 h-5 ml-4" />
            <span
              onClick={() => {
                setShowHeaderSearch(false);
                // open online check-in
              }}
              className="block pl-2 pr-4 cursor-pointer py-3">
              Online Check-in
            </span>
          </div>
        </div>

        <div className="flex-shrink-0 ml-auto pr-2 cursor-pointer" onClick={() => setShowHeaderSearch(true)}>
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-6000  text-white">
            <MagnifyingGlassIcon className="w-5 h-5" />
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`nc-Header nc-Header-3 fixed z-40 top-0 inset-0 bg-black/30 transition-opacity will-change-[opacity] ${
          showHeaderSearch ? "visible" : "invisible opacity-0 pointer-events-none"
        }`}></div>
      {showHeaderSearch && <div id="nc-Header-anchor"></div>}
      <header ref={headerInnerRef} className={`sticky top-0 z-40 ${className}`}>
        <div
          className={`bg-white absolute h-full inset-x-0 top-0 transition-transform will-change-[transform,opacity]
          ${showHeaderSearch ? "duration-75 scale-y-[4.4]" : ""}`}></div>
        <div className="relative px-4 lg:container h-[88px] flex">
          <div className="flex-1 flex justify-between">
            <div className="relative z-10 hidden md:flex flex-1 items-center">
              <Logo />
            </div>

            <div className="flex flex-[2] lg:flex-none mx-auto">
              <div className="flex-1 hidden lg:flex self-center">{renderHeaderSearchBar()}</div>
              {renderHeaderSearch()}
            </div>

            <div className="hidden md:flex relative z-10 flex-1 justify-end text-neutral-700 items-center">
              <div className="flex space-x-2">
                <NotifyDropdown />
                <SignInButton />
                <MenuBar />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
