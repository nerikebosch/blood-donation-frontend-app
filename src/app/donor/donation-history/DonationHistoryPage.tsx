"use client"

import {
    Badge,
    Card,
    Container,
    Group,
    Loader,
    Pagination,
    Text,
    Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

export function DonationHistoryPage() {
    const now = new Date();
    const { token } = useAuth();

    const [appointments, setAppointments] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const PAGE_SIZE = 5;

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [appointmentsRes, slotsRes] = await Promise.all([
                    fetch("http://localhost:8080/api/appointments/mine", {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch("http://localhost:8080/api/slots", {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const appointments = await appointmentsRes.json();
                const slots = await slotsRes.json();

                setAppointments(appointments);
                setSlots(slots);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "BOOKED":
                return "green";
            case "CANCELLED":
                return "red";
            case "COMPLETED":
                return "blue";
            default:
                return "gray";
        }
    };

    if (loading) {
        return (
            <Container py="lg">
                <Loader size="lg" />
                <Text mt="sm">Loading your appointments and slots...</Text>
            </Container>
        );
    }

    const past = appointments.filter(
        (appt) => new Date(appt.slot.dateTime) <= now
    );

    const paginated = past.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const renderCard = (appt) => (
        <Card key={appt.id} shadow="sm" radius="md" withBorder mb="sm">
            <Group justify="apart">
                <Text>{new Date(appt.slot.dateTime).toLocaleString()}</Text>
                <Badge color={getStatusColor(appt.status)}>
                    {appt.status}
                </Badge>
            </Group>
            <Text size="sm" c="dimmed">
                {appt.slot.location}
            </Text>
        </Card>
    );

    return (
        <Container py="lg">
            <Title order={3} mb="xs">
                Past Appointments
            </Title>

            {past.length ? (
                <>
                    {paginated.map(renderCard)}
                    <Group justify="center" mt="md">
                        <Pagination
                            total={Math.ceil(past.length / PAGE_SIZE)}
                            page={page}
                            onChange={setPage}
                        />
                    </Group>
                </>
            ) : (
                <Text size="sm">No past appointments yet.</Text>
            )}
        </Container>
    );
}
