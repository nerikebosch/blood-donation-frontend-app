// src/types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user?: {
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role?: string;   // Add this line — tell TS user has a role
        };
    }

    interface User {
        role?: string; // Also extend User type if needed
    }
}
