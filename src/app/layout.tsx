"use client";

import "./globals.css";
import { Poppins } from "next/font/google";
import "@/styles/index.scss";
import "@/fonts/line-awesome-1.3.0/css/line-awesome.min.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { OverlayProvider, useOverlay } from "@/context/OverlayContext";
import LoadingOverlay from "@/shared/LoadingOverlay";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OverlayProvider>
      <html lang="en" className={poppins.className}>
        <head>
          <title>QAirline</title>
        </head>
        <body className="bg-white text-base theme-cyan-blueGrey relative">
          <Overlay />
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </OverlayProvider>
  );
}

function Overlay() {
  const { isLoading } = useOverlay();

  return (
    isLoading && (
      <LoadingOverlay />
    )
  );
}
