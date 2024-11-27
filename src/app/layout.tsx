import "./globals.css";
import { Poppins } from "next/font/google";
import "@/styles/index.scss";
import "@/fonts/line-awesome-1.3.0/css/line-awesome.min.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.className}>
      <head>
        <title>QAirline</title>
      </head>
      <body className="bg-white text-base theme-cyan-blueGrey">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}