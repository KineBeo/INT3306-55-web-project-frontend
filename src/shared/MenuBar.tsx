import React, { useEffect, useRef } from "react";
import { Modal, ModalContent, useDisclosure, } from "@nextui-org/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import Socials from "./Socials";
import ButtonClose from "./ButtonClose";

export interface MenuBarProps {
  className?: string;
  iconClassName?: string;
}

const MenuBar: React.FC<MenuBarProps> = ({
  className = "p-2.5 rounded-lg text-neutral-700",
  iconClassName = "h-8 w-8",
}) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref}>
      <button
        onClick={onOpen}
        className={`self-center items-center focus:outline-none w-10 h-10 sm:w-12 sm:h-12 hover:bg-gray-100 rounded-full inline-flex ${className}`}>
        <Bars3Icon className={iconClassName} />
      </button>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
        radius="none"
        motionProps={{
          variants: {
            enter: {
              x: 24,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              x: 60,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
        className="fixed right-0 rounded-l-2xl h-full w-auto max-w-sm"
       portalContainer={ref.current as HTMLElement}
      >
        <ModalContent>
          {(onClose) => (
            <div className="overflow-hidden w-full h-screen py-2 bg-white shadow-lg ring-1 divide-y-2 divide-neutral-100">
              <div className="py-6 px-5">
                <Logo />
                <div className="flex flex-col mt-5 text-neutral-700 text-sm">
                  <span>
                    Discover incredible journeys around the globe. Book your ticket today and embark on your next
                    adventure!
                  </span>
                  <div className="mt-4">
                    <Socials className="flex items-center space-x-3 lg:space-x-0 lg:flex-col lg:space-y-2.5 lg:items-start" />
                  </div>
                </div>
                <span className="absolute right-2 top-2 p-1">
                  <ButtonClose onClick={onClose} />
                </span>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MenuBar;
