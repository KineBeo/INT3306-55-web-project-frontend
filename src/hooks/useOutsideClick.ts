"use client";
import "client-only";

import { useEffect } from "react";

function useOutsideClick(ref: React.RefObject<HTMLDivElement>, handleClickOutsideCallback: () => void) {
  useEffect(() => {
    /**
     * Handle if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handleClickOutsideCallback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export default useOutsideClick;
