"use client";

import { useEffect, useState } from 'react';
import { AppointmentList } from './AppointmentList';
import { AppointmentBooking } from './AppointmentBooking';
import { Box, Title, Container, Loader, Text } from '@mantine/core';
import { LOCATION_OPTIONS } from '@/constants/locations';

export default function AppointmentPage() {
    const [appointments, setAppointments] = useState([]);
    const [slots, setSlots] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            console.log("token: "+token);

            const [appointmentsRes, slotsRes] = await Promise.all([
                fetch('http://localhost:8080/api/appointments', {
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

    return (
        <Container py="lg">
            <Title order={2} mb="md">Your Appointments</Title>
            <AppointmentList appointments={appointments} />

            <Box mt="xl">
                <Title order={2} mb="md">Book a New Appointment</Title>
                <AppointmentBooking
                    slots={slots}
                    locations={LOCATION_OPTIONS}
                    onBooked={fetchAll} // Refresh after booking
                />
            </Box>
        </Container>
    );
}
