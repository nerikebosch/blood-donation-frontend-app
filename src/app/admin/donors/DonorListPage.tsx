"use client"

import { useEffect, useState } from "react";
import { Card, Text, Title, Grid } from "@mantine/core";
import { useRouter } from "next/navigation";

interface Donor {
    userId: number;
    name: string;
    surname: string;
    email: string;
}

export default function AdminDonorList() {
    const [donors, setDonors] = useState<Donor[]>([]);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        // First, get all donor profile IDs
        fetch("http://localhost:8080/api/donor-profiles", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then(async (profiles) => {
                // For each profile, get the user
                const results: Donor[] = await Promise.all(
                    profiles.map(async (profile: any) => {
                        const res = await fetch(`http://localhost:8080/api/user/${profile.userId}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        const user = await res.json();
                        return {
                            userId: profile.userId,
                            name: user.name,
                            surname: user.surname,
                            email: user.email,
                        };
                    })
                );
                setDonors(results);
            });
    }, []);

    return (
        <div>
            <Title order={2} mb="md">Donors</Title>
            <Grid>
                {donors.map((donor) => (
                    <Grid.Col span={4} key={donor.userId}>
                        <Card
                            shadow="sm"
                            withBorder
                            onClick={() => router.push(`/admin/donors/${donor.userId}`)}
                            style={{ cursor: "pointer" }}
                        >
                            <Text fw={500}>{donor.name} {donor.surname}</Text>
                            <Text size="sm" c="dimmed">{donor.email}</Text>
                        </Card>
                    </Grid.Col>
                ))}
            </Grid>
        </div>
    );
}
