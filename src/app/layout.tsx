import "./globals.css";
import { Poppins } from "next/font/google";
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
  param,
}: {
  children: React.ReactNode;
  param: any;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="bg-white text-base">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
