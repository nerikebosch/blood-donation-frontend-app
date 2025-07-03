"use client"

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { Card, Group, Text, Title, Badge } from '@mantine/core';

type Slot = {
    dateTime: string;
    location: string;
};

type Appointment = {
    id: number;
    status: 'PENDING' | 'BOOKED' | 'CANCELLED' | 'COMPLETED';
    slot: Slot;
};

interface AppointmentListProps {
    appointments: Appointment[];
}

export function AppointmentList({ appointments }: AppointmentListProps) {
    const now = new Date();

    const upcoming = appointments.filter(
        (appt) => new Date(appt.slot.dateTime) > now
    );

    appointments.forEach(appt => {
        console.log('Appointment ID:', appt.id, 'Status:', appt.status);
    });


    const getStatusColor = (status: Appointment['status']) => {
        switch (status) {
            case 'BOOKED':
                return 'green';
            case 'CANCELLED':
                return 'red';
            case 'COMPLETED':
                return 'blue';
            default:
                return 'gray';
        }
    };

    const renderCard = (appt: Appointment) => (
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
        <>
            <Title order={3} mb="xs">
                Upcoming Appointments
            </Title>
            {upcoming.length ? (
                upcoming.map(renderCard)
            ) : (
                <Text size="sm">No upcoming appointments.</Text>
            )}
        </>
    );
}
