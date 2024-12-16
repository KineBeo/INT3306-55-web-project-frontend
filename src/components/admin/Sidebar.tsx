"use client";

import Link from "next/link";
import { useEffect, useState, useRef, useMemo } from "react";
import { FaTicketAlt, FaPlane, FaPlaneDeparture, FaNewspaper } from "react-icons/fa";
import { TbHomeUp } from "react-icons/tb";
import { BsPeopleFill } from "react-icons/bs";
import { MdLocalAirport } from "react-icons/md";
import { HiMenuAlt1 } from "react-icons/hi";
import useOutsideClick from "@/hooks/useOutsideClick";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const menuItems = useMemo(
    () => [
      { id: "tickets", label: "Tickets", icon: <FaTicketAlt />, href: "/dashboard/tickets" },
      {
        id: "ticket-passengers",
        label: "Ticket Passengers",
        icon: <BsPeopleFill />,
        href: "/dashboard/ticket-passengers",
      },
      { id: "airports", label: "Airports", icon: <MdLocalAirport />, href: "/dashboard/airports" },
      { id: "airplanes", label: "Airplanes", icon: <FaPlane />, href: "/dashboard/airplanes" },
      { id: "flights", label: "Flights", icon: <FaPlaneDeparture />, href: "/dashboard/flights" },
      { id: "articles", label: "Articles", icon: <FaNewspaper />, href: "/dashboard/articles" },
    ],
    []
  );

  useEffect(() => {
    const active = menuItems.find((item) => pathname.startsWith(item.href));
    if (active) {
      setActiveSection(active.id);
    } else {
      setActiveSection("");
    }
  }, [pathname, menuItems, setActiveSection]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => {
    setIsMenuOpen(false);
  });

  return (
    <div ref={ref}>
      <button
        className="fixed top-2.5 md:top-[18px] left-3 z-50 p-2 rounded-md text-neutral-400 hover:bg-neutral-50 focus:outline-none"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu">
        <HiMenuAlt1 className="h-6 w-6" />
      </button>
      <nav
        className={`fixed z-[9999] min-h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
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
          <Link href={"/"} className="w-full flex items-center space-x-3 p-3 rounded-md transition-colors duration-200 text-neutral-600 hover:bg-primary-50 hover:text-primary-500">
            <TbHomeUp className="text-xl" />
            <span>Back to Home</span>
          </Link>
          </ul>
        </div>
      </nav>
      {/* overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsMenuOpen(false)}></div>
      )}
    </div>
  );
};

export default Sidebar;
