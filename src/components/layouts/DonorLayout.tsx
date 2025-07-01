"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import DonorHeader from "./DonorHeader"; // ✅ Import the new header

export default function DonorLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const excludedRoutes = [
        "/loginpage",
        "/registerpage",
        "/admin",
        "/doctor"
    ];

    const shouldHideHeader = excludedRoutes.some(route => pathname.startsWith(route));

    return (
        <>
            {!shouldHideHeader && <DonorHeader />}
            {children}
        </>
    );
}
