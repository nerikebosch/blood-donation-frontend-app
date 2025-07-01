"use client";

import { useAuth } from "@/lib/auth"; // adjust path as needed
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    const { role } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!role || role !== "ROLE_ADMIN") {
            router.replace("/unauthorized"); // or "/loginpage" if you want
        }
    }, [role, router]);

    if (role !== "ROLE_ADMIN") {
        // Optionally render null or a loading spinner while redirecting
        return null;
    }

    return <AdminLayout>{children}</AdminLayout>;
}
