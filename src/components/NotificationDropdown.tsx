"use client";

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from "@nextui-org/react";
import { FC, useRef } from "react";
import { BellIcon } from "@heroicons/react/24/outline";

const notifications: string[] = ["abc", "def", "ghi"];

interface Props {
  className?: string;
}

const NotificationDropdown: FC<Props> = ({ className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref}>
      <Dropdown placement="bottom-end" portalContainer={ref.current as HTMLElement} shouldBlockScroll={false}>
        <DropdownTrigger>
          <button
            className={`self-center w-10 h-10 sm:w-12 sm:h-12 bg-white hover:bg-gray-100 rounded-full inline-flex items-center justify-center text-base font-medium focus:outline-none relative ${className}`}>
            <BellIcon className="h-6 w-6" />
            <span className="w-2 h-2 bg-blue-500 absolute top-2 right-2 rounded-full"></span>
          </button>
        </DropdownTrigger>

        <DropdownMenu>
          {notifications.length > 0 ? (
            <DropdownSection title={"Notifications"}>
              {notifications.map((notification, index) => (
                <DropdownItem key={index} className="">
                  {notification}
                </DropdownItem>
              ))}
            </DropdownSection>
          ) : (
            <DropdownItem className="no-focus no-hover text-black" >No new notifications</DropdownItem>
          )}
         
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default NotificationDropdown;
