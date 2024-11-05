import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export interface ButtonCloseProps {
  className?: string;
  onClick?: () => void;
}

const ButtonClose: React.FC<ButtonCloseProps> = ({
  className = "",
  onClick = () => {},
}) => {
  return (
    <button
      className={
        `w-8 h-8 flex items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 ${className}`}
      onClick={onClick}
    >
      <span className="sr-only">Close</span>
      <XMarkIcon className="w-5 h-5" />
    </button>
  );
};

export default ButtonClose;
