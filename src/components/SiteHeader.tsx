"use client";

import Header from "./Header/Header";
import AdminHeader from "./admin/header";
import { usePathname } from "next/navigation";

const SiteHeader = () => {
    const pathname = usePathname();
    if (pathname.includes("/dashboard")) {
        return (
            <AdminHeader />
        )
    }
    return (
        <Header />
    )
}

export default SiteHeader;