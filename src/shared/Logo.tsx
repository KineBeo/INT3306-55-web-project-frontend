import React from "react";
import logoImg from "@/images/logos/logo.png";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";

export interface LogoProps {
  img?: StaticImageData;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ img = logoImg, className = "w-16" }) => {
  return (
    <Link href="/" className={`ttnc-logo inline-block text-primary-6000 focus:outline-none focus:ring-0 ${className}`}>
      <div className="relative w-full h-16">
        {img ? (
          <Image
            src={img}
            alt="Logo"
            fill
            className="block"
          />
        ) : (
          "Logo Here"
        )}
      </div>
    </Link>
  );
};

export default Logo;
