"use client";

import React, { FC, useEffect, useRef, useState, useCallback } from "react";
import Logo from "@/shared/Logo";
import useOutsideClick from "@/hooks/useOutsideClick";
import SignInButton from "@/shared/SignInButton";
import MenuBar from "@/shared/MenuBar";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import HeaderSearch from "./HeaderSearch/HeaderSearch";
import { useOverlay } from "@/context/OverlayContext";
import { useRouter, usePathname } from "next/navigation";
import { FaPlaneDeparture } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { TiTicket } from "react-icons/ti";
import { GoChecklist } from "react-icons/go";
import HeaderSearch2Mobile from "./HeaderSearch/(Mobile)/HeaderSearch2Mobile";
import SearchForm2Mobile from "./HeaderSearch/(Mobile)/SearchForm2Mobile";
import eventBus from "@/utils/eventBus";
import { User as UserButton, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/auth/authSlice";

interface HeaderProps {
  className?: string;
}

const Header: FC<HeaderProps> = ({ className = "" }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setLoading } = useOverlay();

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Đặt showHeaderSearch thành false mỗi khi pathname thay đổi (route thay đổi)
    switch (pathname) {
      case "/":
        setCurrentTab("Book");
        break;
      case "/booking/manage-booking":
        setCurrentTab("Manage Booking");
        break;
      case "/booking/online-check-in":
        setCurrentTab("Online Check-in");
        break;
      case "/about":
        setCurrentTab("About");
        break;
      default:
        setCurrentTab("Book");
    }
    setShowHeaderSearch(false);
  }, [pathname]);

  useEffect(() => {
    const handleAction = () => {
      if (window.innerWidth < 1024) {
        setShowHeaderSearch(true);
      }
    };

    eventBus.on("bookNowClicked", handleAction);

    return () => {
      eventBus.off("bookNowClicked", handleAction);
    };
  }, []);

  const redirectToSignIn = () => {
    setLoading(true);
    try {
      if (pathname.includes("/auth/signin")) {
        setLoading(false);
      }
      router.push("/auth/signin");
      console.log("Redirect to sign in page");
    } catch (error) {
      console.error(error);
    }
  };

  const [showHeaderSearch, setShowHeaderSearch] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<"Book" | "Manage Booking" | "Online Check-in" | "About">("Book");
  const handleTabChange = (tab: "Book" | "Manage Booking" | "Online Check-in" | "About") => {
    setShowHeaderSearch(false);
    setCurrentTab(tab);
    if (tab === "Book") {
      router.push("/");
    } else if (tab === "Manage Booking") {
      router.push("/booking/manage-booking");
    } else if (tab === "Online Check-in") {
      router.push("/booking/online-check-in");
    } else {
      router.push("/about");
    }
  };

  const headerInnerRef = useRef<HTMLDivElement>(null);

  const handleClickOutsideCallback = useCallback(() => {
    setShowHeaderSearch(false);
  }, []);

  useOutsideClick(headerInnerRef, handleClickOutsideCallback);

  const renderHeaderSearch = () => {
    return (
      <div
        className={`absolute bg-white inset-x-0 top-0 transition-all will-change-[transform,opacity] ${
          showHeaderSearch
            ? "visible"
            : "-translate-x-0 -translate-y-[90px] scale-x-[0.395] scale-y-[0.6] opacity-0 invisible pointer-events-none"
        }`}>
        <div className={`w-full hidden lg:block max-w-4xl mx-auto pb-6`}>
          <HeaderSearch defaultTab={currentTab} onTabChange={handleTabChange} />
        </div>
        <div className={`w-full block lg:hidden max-w-4xl mx-auto pb-6 pt-28 `}>
          <SearchForm2Mobile />
        </div>
      </div>
    );
  };

  const renderHeaderNavBar = () => {
    return (
      <div
        className={`w-full relative flex items-center justify-between bg-white border border-neutral-200 rounded-full shadow hover:shadow-md transition-all ${
          showHeaderSearch
            ? "-translate-x-0 translate-y-20 scale-x-[2.55] scale-y-[1.8] opacity-0 pointer-events-none invisible"
            : "visible"
        }`}>
        <div className="flex items-center font-medium text-sm">
          <div
            className={`flex items-center cursor-pointer ${currentTab === "Book" ? "text-primary-700" : ""}`}
            onClick={() => router.push("/")}>
            <FaPlaneDeparture className="w-5 h-5 ml-5" />
            <span className="block pl-2 pr-4 py-3">Book</span>
          </div>

          <span className="h-5 w-[1px] bg-neutral-300"></span>

          <div
            className={`flex items-center cursor-pointer ${currentTab === "Manage Booking" ? "text-primary-700" : ""}`}
            onClick={() => setShowHeaderSearch(false)}>
            <GoChecklist className="w-5 h-5 ml-4" />
            <span
              onClick={() => router.push("/booking/manage-booking")}
              className="block pl-2 pr-4 cursor-pointer py-3 ">
              Manage Booking
            </span>
          </div>

          <span className="h-5 w-[1px] bg-neutral-300"></span>

          <div
            className={`flex items-center cursor-pointer ${currentTab === "Online Check-in" ? "text-primary-700" : ""}`}
            onClick={() => setShowHeaderSearch(false)}>
            <TiTicket className="w-5 h-5 ml-4" />
            <span
              onClick={() => router.push("/booking/online-check-in")}
              className="block pl-2 pr-4 cursor-pointer py-3">
              Online Check-in
            </span>
          </div>

          <span className="h-5 w-[1px] bg-neutral-300"></span>

          <div
            className={`flex items-center cursor-pointer ${currentTab === "About" ? "text-primary-700" : ""}`}
            onClick={() => setShowHeaderSearch(false)}>
            <IoMdInformationCircleOutline className="w-5 h-5 ml-4" />
            <span
              onClick={() => router.push("/about")}
              className="block pl-2 pr-4 cursor-pointer py-3">
              About
            </span>
          </div>
        </div>

        <div className="flex-shrink-0 ml-auto pr-2 cursor-pointer" onClick={() => setShowHeaderSearch(true)}>
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-500  text-white">
            <MagnifyingGlassIcon className="w-5 h-5" />
          </span>
        </div>
      </div>
    );
  };

  const renderHeaderSearchButton2Mobile = () => {
    return (
      <div
        className={`w-full relative transition-all will-change-[transform,opacity] z-40 rounded-full ${
          showHeaderSearch ? "bg-neutral-100 shadow-lg" : "bg-white"
        }`}>
        <HeaderSearch2Mobile onClickSearch={() => setShowHeaderSearch(!showHeaderSearch)} />
      </div>
    );
  };

  return (
    <>
      <div
        className={`nc-Header fixed z-[100] top-0 inset-0 bg-black/40 transition-opacity will-change-[opacity] ${
          showHeaderSearch ? "visible" : "invisible opacity-0 pointer-events-none"
        }`}></div>
      <header
        ref={headerInnerRef}
        className={`sticky top-0 z-[9000] shadow-md border-b border-neutral-200 nc-header-bg ${className}`}>
        <div
          className={`bg-white absolute h-full inset-x-0 top-0 transition-transform will-change-[transform,opacity]
          ${showHeaderSearch ? "duration-75 scale-y-[4.4]" : "bg-opacity-40"}`}></div>
        <div className="relative px-3 lg:container h-[88px] flex ">
          <div className="flex-1 flex justify-between">
            <div className="relative z-10 hidden md:flex flex-1 items-center">
              <Logo className="w-16" />
            </div>

            <div className="flex flex-[2] lg:flex-none mx-auto">
              <div className="flex-1 hidden lg:flex self-center">{renderHeaderNavBar()}</div>
              <div className="self-center flex-1 lg:hidden w-full max-w-lg mx-auto">
                {renderHeaderSearchButton2Mobile()}
              </div>
              {renderHeaderSearch()}
            </div>

            <div className="hidden md:flex relative z-40 flex-1 justify-end text-neutral-700 items-center">
              <div className="flex space-x-2">
                {user ? (
                  <Dropdown placement="bottom-start">
                    <DropdownTrigger>
                      <UserButton
                        as="button"
                        avatarProps={{
                          isBordered: true,
                          src: "https://www.svgrepo.com/show/492675/avatar-girl.svg",
                        }}
                        name={user.fullname}
                        description={user.role}
                        classNames={{
                          name: "ml-1 text-sm",
                          description: "ml-1 text-xs",
                        }}
                      />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="User Actions" variant="flat">
                      <DropdownItem
                        key="account"
                        onClick={() => {
                          router.push("/account");
                        }}>
                        My Account
                      </DropdownItem>
                      <DropdownItem
                        key="signout"
                        color="danger"
                        onClick={() => {
                          dispatch(logout());
                          router.push("/");
                        }}>
                        Sign Out
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                ) : (
                  <SignInButton onClick={redirectToSignIn} />
                )}
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
