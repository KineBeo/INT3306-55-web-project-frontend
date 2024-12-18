"use client";

import Logo from "@/shared/Logo";
import Socials from "@/shared/Socials";
import { CustomLink } from "@/types/other";
import React from "react";

export interface WidgetFooterMenu {
  id: string;
  title: string;
  menus: CustomLink[];
}

const widgetMenus: WidgetFooterMenu[] = [
  {
    id: "1",
    title: "Legal",
    menus: [
      { href: "#", label: "Terms & Conditions" },
      { href: "#", label: "Conditions of Carriage" },
      { href: "#", label: "Cookies Policy" },
      { href: "#", label: "Privacy Policy" },
    ],
  },
  {
    id: "2",
    title: "Support",
    menus: [
      { href: "#", label: "Claim/Suggestion" },
      { href: "#", label: "HelpDesk" },
      { href: "#", label: "Web Accessibility" },
      { href: "#", label: "Customer Service Plan" },
      { href: "#", label: "QAirline Virtual Assistant" },
      { href: "#", label: "QAirline App" },
    ],
  },
  {
    id: "3",
    title: "Cargo",
    menus: [{ href: "#", label: "Cargo Website" }],
  },
  {
    id: "4",
    title: "Useful Information",
    menus: [
      { href: "#", label: "Partnership with Lotusmiles" },
      { href: "#", label: "Baggage Fees" },
      { href: "#", label: "Heritage magazine" },
      { href: "#", label: "Travel guide" },
      { href: "#", label: "Optional & Special Service Charges" },
      { href: "#", label: "Tarmac Delay Plan" },
    ],
  },
];

const Footer: React.FC = () => {
  const renderWidgetMenuItem = (menu: WidgetFooterMenu, index: number) => {
    return (
      <div key={index} className="text-sm">
        <h2 className="font-semibold text-neutral-200">{menu.title}</h2>
        <ul className="mt-5 space-y-4">
          {menu.menus.map((item, index) => (
            <li key={index}>
              <a key={index} className="text-neutral-300 hover:text-white" href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      <div className="nc-Footer relative py-24 lg:py-28 border-t border-neutral-700 bg-neutral-900">
        <div className="container grid grid-cols-2 gap-y-10 gap-x-5 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10 ">
          <div className="grid grid-cols-4 gap-5 col-span-2 md:col-span-4 lg:md:col-span-1 lg:flex lg:flex-col">
            <div className="col-span-2 md:col-span-1">
              <Logo className="w-24" textColor="white" />
            </div>
            <div className="col-span-2 flex items-center md:col-span-3">
              <Socials
                className="flex items-center space-x-3 lg:space-x-0 lg:flex-col lg:space-y-2.5 lg:items-start"
                itemClassName="text-neutral-300 hover:text-white"
              />
            </div>
          </div>
          {widgetMenus.map(renderWidgetMenuItem)}
        </div>
      </div>
    </>
  );
};

export default Footer;
