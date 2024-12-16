"use client";

import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon, CheckBadgeIcon
} from "@heroicons/react/24/outline";
import React, { useRef } from "react";
import { PathName } from "@/routers/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  link?: PathName;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const NAV: NavItem[] = [
  {
    name: "Explore",
    link: "/",
    icon: MagnifyingGlassIcon,
  },
  {
    name: "Manage Booking",
    link: "/booking/manage-booking",
    icon: ClipboardDocumentListIcon,
  },
  {
    name: "Check-in",
    link: "/booking/online-check-in",
    icon: CheckBadgeIcon,
  },
  {
    name: "Account",
    link: "/account",
    icon: UserCircleIcon,
  },
];

const FooterNav = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  const renderItem = (item: NavItem, index: number) => {
    const isActive = pathname === item.link;

    return item.link ? (
      <Link
        key={index}
        href={item.link}
        className={`flex flex-col items-center justify-between text-neutral-500 ${
          isActive ? "text-neutral-900" : ""
        }`}
      >
        <item.icon className={`w-6 h-6 ${isActive ? "text-primary-6000" : ""}`} />
        <span
          className={`text-[11px] leading-none mt-1 ${
            isActive ? "text-primary-6000" : ""
          }`}
        >
          {item.name}
        </span>
      </Link>
    ) : (
      <div
        key={index}
        className={`flex flex-col items-center justify-between text-neutral-500 ${
          isActive ? "text-neutral-900" : ""
        }`}
      >
        <item.icon className={`self-center w-6 h-6`} />
        <span className="text-[11px] leading-none mt-1">{item.name}</span>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="FooterNav block lg:!hidden p-2 bg-white fixed top-auto bottom-0 inset-x-0 z-40 border-t border-neutral-300 
      transition-transform duration-300 ease-in-out"
    >
      <div className="w-full max-w-lg flex justify-around mx-auto text-sm item-center ">
        {/* MENU */}
        {NAV.map(renderItem)}
      </div>
    </div>
  );
};

export default FooterNav;
