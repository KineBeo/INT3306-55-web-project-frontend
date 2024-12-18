import React, { FC } from "react";

export interface SocialType {
  name: string;
  icon: string;
  href: string;
}

export interface SocialsProps {
  className?: string;
  itemClassName?: string;
}

const socials: SocialType[] = [
  { name: "Facebook", icon: "lab la-facebook-f", href: "https://www.vietnamairlines.com/vn/vi/home"},
  { name: "Twitter", icon: "lab la-twitter", href: "https://www.vietjetair.com/"},
  { name: "Instagram", icon: "lab la-instagram", href: "https://www.bambooairways.com/vn/vi/home" },
  { name: "Linkedin", icon: "lab la-linkedin", href: "https://www.jetstar.com/vn/vi/home" },
];

const Socials: FC<SocialsProps> = ({ className = "space-y-2.5", itemClassName = "text-neutral-700 hover:text-black" }) => {
  const renderItem = (item: SocialType, index: number) => (
    <a
      href={item.href}
      className={`flex items-center text-2xl leading-none space-x-2 group ${itemClassName}`}
      key={index}
    >
      <i className={item.icon}></i>
      <span className="hidden lg:block text-sm">{item.name}</span>
    </a>
  );

  return (
    <div className={`nc-Socials ${className}`} data-nc-id="Socials">
      {socials.map(renderItem)}
    </div>
  );
};

export default Socials;