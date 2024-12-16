"use client";

import React, { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";

interface LoadingButtonProps {
  classNames?: {
    base?: string;
    loading?: string;
  };
  text?: string;
  onClick?: () => void;
}

const LoadingButton = ({
  classNames = {
    base: "relative flex items-center justify-center px-6 py-3 text-base font-semibold text-white rounded-lg bg-primary-500 hover:bg-primary-6000",
    loading: "bg-primary-6000 hover:bg-primary-6000",
  },
  text = "Click me",
  onClick,
}: LoadingButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
      try {
        //   setTimeout(() => {
        //       if (onClick) {
        //           onClick();
        //       }
          // }, 1000);
          await new Promise((resolve) => setTimeout(resolve, 500));
            if (onClick) {
                onClick();
            }
    } catch (error) {
      console.error("Error during async operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      aria-live="polite"
      className={`
        transition-all
        duration-300
        disabled:cursor-not-allowed
        ${classNames.base}
        ${isLoading ? classNames.loading : ""}
      `}>
      {isLoading ? (
        <>
          <BiLoaderAlt className="w-5 h-5 mr-2 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default LoadingButton;
