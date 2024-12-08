"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { FaTicketAlt, FaPlane, FaPlaneDeparture, FaNewspaper } from "react-icons/fa";
import { HiMenuAlt1 } from "react-icons/hi";
import useOutsideClick from "@/hooks/useOutsideClick";

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const menuItems = [
    { id: "tickets", label: "Tickets", icon: <FaTicketAlt />, href: "/dashboard/tickets" },
    { id: "airplanes", label: "Airplanes", icon: <FaPlane />, href: "/dashboard/airplanes" },
    { id: "flights", label: "Flights", icon: <FaPlaneDeparture />, href: "/dashboard/flights" },
    { id: "articles", label: "Articles", icon: <FaNewspaper />, href: "/dashboard/articles" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => {
    if (window.innerWidth < 1280) {
      setIsMenuOpen(false);
    }
  });

  return (
    <div ref={ref} className="xl:w-64 w-0">
      <button
        className="xl:hidden fixed top-2.5 md:top-5 left-3 z-50 p-2 rounded-md text-neutral-300 hover:bg-neutral-50 focus:outline-none"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu">
        <HiMenuAlt1 className="h-6 w-6" />
      </button>
      <nav
        className={`min-h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
        }`}>
        {/* Mobile menu button */}

        <div className="p-6">
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={`${item.href}`}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-md transition-colors duration-200 ${
                    activeSection === item.id
                      ? "bg-primary-500 text-white"
                      : "text-neutral-600 hover:bg-primary-50 hover:text-primary-500"
                  }`}
                  aria-label={`Navigate to ${item.label}`}>
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
