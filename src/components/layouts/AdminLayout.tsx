"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import AdminHeader from "./AdminHeader"; // ✅ Import the new header

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const excludedRoutes = [
        "/loginpage",
        "/registerpage",
        "/donor"
    ];

    const shouldHideHeader = excludedRoutes.some(route => pathname.startsWith(route));

    return (
        <>
            {!shouldHideHeader && <AdminHeader />}
            {children}
        </>
    );
}
