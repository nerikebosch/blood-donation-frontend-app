"use client"

import {Badge, Card, Container, Group, Loader, Text, Title} from "@mantine/core";
import {useEffect, useState} from "react";
import { useAuth } from "@/lib/auth";

export function DonationHistoryPage() {
    const now = new Date();
    const [appointments, setAppointments] = useState([]);
    const [slots, setSlots] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();


    const fetchAll = async () => {
        setLoading(true);
        try {
            console.log("token: "+token);

            const [appointmentsRes, slotsRes] = await Promise.all([
                fetch('http://localhost:8080/api/appointments/mine', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }),
                fetch('http://localhost:8080/api/slots', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }),
            ]);

            console.log("Slots response status:", slotsRes.status);

            if (!appointmentsRes.ok) {
                const errorText = await appointmentsRes.text();
                console.error("Appointments error:", appointmentsRes.status, errorText);
            }

            if (!slotsRes.ok) {
                const errorText = await slotsRes.text();
                console.error("Slots error:", slotsRes.status, errorText);
                return;
            }

            const appointments = await appointmentsRes.json();
            const slots = await slotsRes.json();
            console.log("Raw slots text:", slots);

            const locations = [...new Set(slots.map(slot => slot.location))];

            setAppointments(appointments);
            setSlots(slots);
            setLocations(locations);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    if (loading) {
        return (
            <Container py="lg">
                <Loader size="lg" />
                <Text mt="sm">Loading your appointments and slots...</Text>
            </Container>
        );
    }

    const past = appointments.filter(appt => new Date(appt.slot.dateTime) <= now);

    const getStatusColor = (status) => {
        switch (status) {
            case 'CONFIRMED': return 'green';
            case 'CANCELLED': return 'red';
            case 'COMPLETED': return 'blue';
            default: return 'gray';
        }
    };

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
    return (
        <>
            <Container py="lg">
                <Title order={3} mb="xs">Past Appointments</Title>
                {past.length ? past.map(renderCard) : <Text size="sm">No past appointments yet.</Text>}
            </Container>
        </>
    );
}