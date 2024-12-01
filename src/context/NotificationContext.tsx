"use client";

import React, { createContext, useState, useCallback, useContext, ReactNode } from "react";
import { FaCheckCircle } from "react-icons/fa";
import ButtonClose from "@/shared/ButtonClose";

type NotificationContextType = {
  showNotification: (message: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");

  const showNotification = useCallback((msg: string) => {
    setMessage(msg);
    setIsVisible(true);

    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  }, []);

  const dismissNotification = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
        <div
          className={`fixed bottom-5 right-0 flex justify-center transform transition-transform duration-400 ease-in-out z-[9999] ${
            isVisible ? "translate-x-0" : "translate-x-full"
          }`}
          role="alert"
          aria-live="polite"
        >
          <div className="mt-4 max-w-md w-full bg-white rounded-lg shadow-xl p-4 mx-4 flex items-center border-1 border-gray-200 justify-between border-l-8 border-l-cyan-500">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <FaCheckCircle className="text-cyan-500 text-2xl" />
              </div>
              <p className="text-gray-700">{message}</p>
            </div>
            <ButtonClose onClick={dismissNotification} />
          </div>
        </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
