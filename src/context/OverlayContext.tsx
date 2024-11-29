"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const OverlayContext = createContext({
  isLoading: false,
  setLoading: (loading: boolean) => {},
});

export const OverlayProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname(); // Lấy pathname từ next/navigation

  useEffect(() => {
    setIsLoading(true); // Bắt đầu loading khi chuyển trang
    const timeout = setTimeout(() => {
      setIsLoading(false); // Dừng loading sau 500ms
    }, 500);

    // Cleanup khi pathname thay đổi
    return () => clearTimeout(timeout);
  }, [pathname]); // Mỗi khi pathname thay đổi, sẽ chạy lại useEffect

  return (
    <OverlayContext.Provider value={{ isLoading, setLoading: setIsLoading }}>
      {children}
    </OverlayContext.Provider>
  );
};

export const useOverlay = () => useContext(OverlayContext);
