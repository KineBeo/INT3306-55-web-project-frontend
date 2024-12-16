"use client";

import "./globals.css";
import { Poppins } from "next/font/google";
import "@/styles/index.scss";
import "@/fonts/line-awesome-1.3.0/css/line-awesome.min.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { OverlayProvider, useOverlay } from "@/context/OverlayContext";
import LoadingOverlay from "@/shared/LoadingOverlay";
import { NotificationProvider } from "@/context/NotificationContext";
import { Provider } from "react-redux";
import { store, persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
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
      "/account": "My Account",
      "/not-found": "Page Not Found",
      "/dashboard": "Dashboard",
      "/dashboard/account": "My Account",
      "/dashboard/signin": "Admin Sign",
      "/dashboard/airports": "Airports",
      "/dashboard/airplanes": "Airplanes",
      "/dashboard/flights": "Flights",
      "/dashboard/articles": "Articles",
      "/dashboard/tickets": "Tickets",
      "/dashboard/ticket-passengers": "Ticket Passengers",
    };

    const title = routeTitles[pathname] || "QAirline";
    document.title = title;
  }, [pathname]);

  return (
    <html lang="en" className={poppins.className}>
      <body className="bg-white text-base theme-cyan-blueGrey relative">
        <Provider store={store}>
          <PersistGate loading={<Overlay />} persistor={persistor}>
            <OverlayProvider>
              <NotificationProvider>
                <Overlay />
                <SiteHeader />
                {children}
                <SiteFooter />
              </NotificationProvider>
            </OverlayProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}

function Overlay() {
  const { isLoading } = useOverlay();

  return isLoading && <LoadingOverlay />;
}
