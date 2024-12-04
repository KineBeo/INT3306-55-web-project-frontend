"use client";

import "./globals.css";
import { Poppins } from "next/font/google";
import "@/styles/index.scss";
import "@/fonts/line-awesome-1.3.0/css/line-awesome.min.css";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer from "@/components/Footer/Footer";
import FooterNav from "@/components/Footer/FooterNav";
import { OverlayProvider, useOverlay } from "@/context/OverlayContext";
import LoadingOverlay from "@/shared/LoadingOverlay";
import { NotificationProvider } from "@/context/NotificationContext";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const routeTitles: Record<string, string> = {
      "/": "QAirline",
      "/about": "About Us",
      "/booking/find-flight": "Find Flight",
      "/booking/checking-ticket-info": "Checking Ticket Info",
      "/auth/signin": "Sign In",
      "/auth/signup": "Sign Up",
      "/not-found": "Page Not Found",
    };

    const title = routeTitles[pathname] || "QAirline";
    document.title = title;
  }, [pathname]);

  return (
    <OverlayProvider>
      <html lang="en" className={poppins.className}>
        <Provider store={store}>
          <body className="bg-white text-base theme-cyan-blueGrey relative">
            <NotificationProvider>
              <Overlay />
              <SiteHeader />
              {children}
              <FooterNav />
              <Footer />
            </NotificationProvider>
          </body>
        </Provider>
      </html>
    </OverlayProvider>
  );
}

function Overlay() {
  const { isLoading } = useOverlay();

  return isLoading && <LoadingOverlay />;
}
