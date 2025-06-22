// src/app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
    TextInput,
    Paper,
    Button,
    Title,
    Stack,
    Loader,
    Center,
} from "@mantine/core";

interface User {
    id: number;
    name: string;
    surname: string;
    email: string;
}

export default function DonorProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [form, setForm] = useState({ name: "", surname: "", email: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        (async () => {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8080/api/user/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                console.error("Failed to load profile");
                setLoading(false);
                return;
            }
            const data: User = await res.json();
            setUser(data);
            setForm({ name: data.name, surname: data.surname, email: data.email });
            setLoading(false);
        })();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/user/me", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(form),
        });
        if (!res.ok) {
            alert("Failed to save profile");
        } else {
            alert("Profile saved");
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <Center style={{ height: "100vh" }}>
                <Loader size="lg" />
            </Center>
        );
    }

    return (
        <Paper p="lg" maw={400} mx="auto">
            <Title order={2} mb="md">Your Profile</Title>
            <Stack>
                <TextInput
                    label="First Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.currentTarget.value })}
                />
                <TextInput
                    label="Surname"
                    value={form.surname}
                    onChange={(e) => setForm({ ...form, surname: e.currentTarget.value })}
                />
                <TextInput
                    label="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.currentTarget.value })}
                />
                <Button onClick={handleSave} loading={saving}>
                    Save Changes
                </Button>
            </Stack>
        </Paper>
    );
}
