"use client";

import {
    Card,
    Group,
    Text,
    Title,
    Divider,
    Badge,
    Button,
    Select,
    Pagination,
    Stack, Container,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

type AppointmentStatus = "PENDING" | "BOOKED" | "CANCELLED" | "COMPLETED";

type Appointment = {
    id: number;
    userId: number;
    bookedAt: string;
    status: AppointmentStatus;
    slot: {
        dateTime: string;
        location: string;
        capacity: number;
    };
    user: {
        name: string;
        surname: string;
        email: string;
    } | null;
};

export function AdminAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const { token } = useAuth();
    const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "ALL">("ALL");
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 5;

    useEffect(() => {
        fetchAppointments();
    }, []);

    async function fetchAppointments() {
        const res = await fetch("http://localhost:8080/api/appointments", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const appts: Omit<Appointment, "user">[] = await res.json();

        const withUsers = await Promise.all(
            appts.map(async (a) => {
                let user = null;
                try {
                    const userRes = await fetch(
                        `http://localhost:8080/api/user/${a.userId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    if (userRes.ok) user = await userRes.json();
                } catch {}
                return { ...a, user };
            })
        );

        setAppointments(withUsers);
    }

    async function updateStatus(id: number, newStatus: AppointmentStatus) {
        await fetch(`http://localhost:8080/api/appointments/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ appointmentStatus: newStatus }),
        });
        await fetchAppointments();
    }

    function getStatusColor(s: AppointmentStatus) {
        switch (s) {
            case "BOOKED":
                return "green";
            case "CANCELLED":
                return "red";
            case "COMPLETED":
                return "blue";
            case "PENDING":
                return "gray";
        }
    }

    // ⛔ Limit valid transitions
    function getNextStatusOptions(status: AppointmentStatus): AppointmentStatus[] {
        switch (status) {
            case "BOOKED":
                return ["COMPLETED", "CANCELLED"];
            default:
                return [];
        }
    }

    const pendingAppointments = appointments.filter((a) => a.status === "PENDING");

    const filteredAppointments = appointments
        .filter((a) => a.status !== "PENDING")
        .filter((a) => statusFilter === "ALL" || a.status === statusFilter);

    const paginatedAppointments = filteredAppointments.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const renderCard = (a: Appointment) => (
        <Card key={a.id} shadow="sm" radius="md" withBorder mb="sm">
            <Group position="apart">
                <Text>{new Date(a.slot.dateTime).toLocaleString()}</Text>
                <Badge color={getStatusColor(a.status)}>{a.status}</Badge>
            </Group>

            <Text size="sm" c="dimmed">
                {a.slot.location}
            </Text>

            {a.user ? (
                <>
                    <Text fw={500} mt="xs">
                        {a.user.name} {a.user.surname}
                    </Text>
                    <Text size="sm" c="dimmed">
                        {a.user.email}
                    </Text>
                </>
            ) : (
                <Text color="red" mt="xs">
                    User info unavailable
                </Text>
            )}

            {/* PENDING → BOOKED or CANCELLED */}
            {a.status === "PENDING" && (
                <Group mt="sm">
                    <Button
                        color="green"
                        onClick={() => updateStatus(a.id, "BOOKED")}
                    >
                        Accept
                    </Button>
                    <Button
                        color="red"
                        variant="outline"
                        onClick={() => updateStatus(a.id, "CANCELLED")}
                    >
                        Reject
                    </Button>
                </Group>
            )}

            {/* BOOKED → COMPLETED or CANCELLED */}
            {a.status !== "PENDING" && getNextStatusOptions(a.status).length > 0 && (
                <Group mt="sm">
                    <Select
                        placeholder="Change status"
                        data={getNextStatusOptions(a.status)}
                        value={null}
                        onChange={(v) =>
                            updateStatus(a.id, v as AppointmentStatus)
                        }
                        allowDeselect={false}
                        size="xs"
                        w={160}
                    />
                </Group>
            )}
        </Card>
    );

    return (
        <Container >
            <div>
                <Title order={3} mb="md">
                    Pending Appointments
                </Title>
                {pendingAppointments.length ? (
                    pendingAppointments.map(renderCard)
                ) : (
                    <Text size="sm">No pending appointments.</Text>
                )}

                <Divider my="lg" />

                <Group mb="md" justify="space-between">
                    <Title order={3}>All Appointments</Title>
                    <Select
                        data={["ALL", "BOOKED", "COMPLETED", "CANCELLED"]}
                        value={statusFilter}
                        onChange={(v) => setStatusFilter(v as any)}
                        placeholder="Filter by status"
                        w={200}
                    />
                </Group>

                <Stack>
                    {paginatedAppointments.length ? (
                        paginatedAppointments.map(renderCard)
                    ) : (
                        <Text size="sm">No appointments to show.</Text>
                    )}
                </Stack>

                {filteredAppointments.length > PAGE_SIZE && (
                    <Group justify="center" mt="md">
                        <Pagination
                            total={Math.ceil(filteredAppointments.length / PAGE_SIZE)}
                            page={page}
                            onChange={setPage}
                        />
                    </Group>
                )}
            </div>
        </Container>
    );
}
