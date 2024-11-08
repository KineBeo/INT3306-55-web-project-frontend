import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from "@nextui-org/react";
import { FC, useRef, useState, useEffect } from "react";
import { BellIcon } from "@heroicons/react/24/outline";

const notifications: string[] = ["abc", "def", "ghi"];

interface Props {
  className?: string;
}

const NotificationDropdown: FC<Props> = ({ className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setIsReady(true);
    }
  }, []);

  return (
    <div ref={ref}>
      {isReady && (
        <Dropdown placement="bottom-end" portalContainer={ref.current as HTMLElement} shouldBlockScroll={false}>
          <DropdownTrigger>
            <button
              className={`self-center w-10 h-10 sm:w-12 sm:h-12 hover:bg-gray-100 rounded-full inline-flex items-center justify-center text-base font-medium focus:outline-none relative ${className}`}>
              <BellIcon className="h-6 w-6" />
              <span className="w-2 h-2 bg-primary-6000 absolute top-2 right-2 rounded-full"></span>
            </button>
          </DropdownTrigger>

          <DropdownMenu>
            {notifications.length > 0 ? (
              <DropdownSection title={"Notifications"} classNames={{
                heading: "text-md p-2 text-neutral-800 font-semibold",
              }}>
                {notifications.map((notification, index) => (
                  <DropdownItem key={index} className="">
                    {notification}
                  </DropdownItem>
                ))}
              </DropdownSection>
            ) : (
              <DropdownItem className="no-focus no-hover text-black">No new notifications</DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );
};

export default NotificationDropdown;
