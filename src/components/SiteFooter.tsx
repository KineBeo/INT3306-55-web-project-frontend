"use client";

import Footer from "./Footer/Footer";
import FooterNav from "./Footer/FooterNav";
import { usePathname } from "next/navigation";

const SiteFooter = () => {
  const pathname = usePathname();
  if (pathname.includes("/dashboard")) {
      return (
        <Footer />
    )
  }
  return (
    <>
      <FooterNav />
      <Footer />
    </>
  );
};

export default SiteFooter;
