import React, { FC } from "react";

export interface SocialType {
  name: string;
  icon: string;
  href: string;
}

export interface SocialsProps {
  className?: string;
}

const socials: SocialType[] = [
  { name: "Facebook", icon: "lab la-facebook-f", href: "#"},
  { name: "Twitter", icon: "lab la-twitter", href: "#"},
  { name: "Instagram", icon: "lab la-instagram", href: "#" },
  { name: "Linkedin", icon: "lab la-linkedin", href: "#" },
];

const Socials: FC<SocialsProps> = ({ className = "space-y-2.5" }) => {
  const renderItem = (item: SocialType, index: number) => (
    <a
      href={item.href}
      className="flex items-center text-2xl text-neutral-700 hover:text-black leading-none space-x-2 group"
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