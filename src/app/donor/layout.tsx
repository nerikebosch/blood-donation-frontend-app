"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DonorLayout from "@/components/layouts/DonorLayout";

export default function DonorLayoutWrapper({ children }: { children: React.ReactNode }) {
    const { role } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!role || role !== "ROLE_DONOR") {
            router.replace("/unauthorized"); // or "/loginpage"
        }
    }, [role, router]);

    if (role !== "ROLE_DONOR") {
        // Optional: return null or loading spinner while redirecting
        return null;
    }

    return <DonorLayout>{children}</DonorLayout>;
}
