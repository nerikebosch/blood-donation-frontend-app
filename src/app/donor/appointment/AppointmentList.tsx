"use client"

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { Card, Group, Text, Title, Divider, Badge } from '@mantine/core';

export function AppointmentList({ appointments }) {
    const now = new Date();
    console.log(appointments);

    const upcoming = appointments.filter(appt => new Date(appt.slot.dateTime) > now);
    const past = appointments.filter(appt => new Date(appt.slot.dateTime) <= now);

    const renderCard = (appt) => (

        <Card key={appt.id} shadow="sm" radius="md" withBorder mb="sm">
            <Group position="apart">
                <Text>{new Date(appt.slot.dateTime).toLocaleString()}</Text>
                <Badge color={getStatusColor(appt.appointmentStatus)}>
                    {appt.appointmentStatus}
                </Badge>
            </Group>
            <Text size="sm" c="dimmed">
                {appt.slot.location}
            </Text>
        </Card>
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'CONFIRMED': return 'green';
            case 'CANCELLED': return 'red';
            case 'COMPLETED': return 'blue';
            default: return 'gray';
        }
    };

    return (
        <>
            <Title order={3} mb="xs">Upcoming Appointments</Title>
            {upcoming.length ? upcoming.map(renderCard) : <Text size="sm">No upcoming appointments.</Text>}
        </>
    );
}
