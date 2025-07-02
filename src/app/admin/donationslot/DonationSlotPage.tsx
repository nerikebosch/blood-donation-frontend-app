'use client';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { useState, useEffect } from 'react';
import {
    Button,
    Paper,
    Title,
    NumberInput,
    Container,
    Table,
    Stack,
    Select,
    Loader,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { useAuth } from "@/lib/auth";

export interface DonationSlot {
    id: number;
    dateTime: string; // ISO string
    location: string;
    capacity: number;
    bookedCount: number;
}

// 1. Location options (Enum-style)
const LOCATION_OPTIONS = [
    'Wojewódzki Szpital Specjalistyczny',
    'Regionalne Centrum Krwiodawstwa',
    'Uniwersytecki Szpital Kliniczny',
    'Dolnośląskie Centrum Transplantacji',
    'Mobilny Punkt Poboru Krwi (Plac Grunwaldzki)',
];



// 2. Time slot options: Every hour from 08:00 to 17:00
const TIME_OPTIONS = Array.from({ length: 10 }, (_, i) =>
    `${String(i + 8).padStart(2, '0')}:00`
);

export default function DonationSlotPage() {
    const [location, setLocation] = useState<string | null>(null);
    const [capacity, setCapacity] = useState(1);
    const [date, setDate] = useState<Date | null>(new Date());
    const [time, setTime] = useState<string | null>(null);
    const [slots, setSlots] = useState<DonationSlot[]>([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    const fetchSlots = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8080/api/slots', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data: DonationSlot[] = await res.json();
            setSlots(data);
        } catch (err) {
            console.error('Failed to fetch slots:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!date || !time || !location) return;

        const [hour, minute] = time.split(':').map(Number);
        const dateTime = dayjs(date)
            .hour(hour)
            .minute(minute)
            .second(0)
            .format('YYYY-MM-DDTHH:mm:ss');

        try {
            const res = await fetch('http://localhost:8080/api/slots', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({ location, capacity, dateTime }),
            });

            if (!res.ok) throw new Error('Failed to create slot');
            await fetchSlots();
            setLocation(null);
            setCapacity(1);
            setDate(new Date());
            setTime(null);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    return (
        <Container size="md">
            <Title align="center" my="md">
                Admin: Create Donation Slot
            </Title>

            <Paper withBorder shadow="md" p="lg" radius="md">
                <Stack>
                    <Select
                        label="Location"
                        data={LOCATION_OPTIONS}
                        value={location}
                        onChange={setLocation}
                        placeholder="Select a hospital"
                        required
                    />
                    <DatePicker
                        label="Date"
                        value={date}
                        onChange={setDate}
                        required
                    />
                    <Select
                        label="Time"
                        data={TIME_OPTIONS}
                        value={time}
                        onChange={setTime}
                        placeholder="Select time"
                        required
                    />
                    <NumberInput
                        label="Capacity"
                        value={capacity}
                        onChange={(val) => setCapacity(val || 1)}
                        min={1}
                        required
                    />
                    <Button onClick={handleSubmit}>Create Slot</Button>
                </Stack>
            </Paper>

            <Title order={3} mt="xl" mb="sm">
                Existing Slots
            </Title>

            <Table striped highlightOnHover withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Date & Time</Table.Th>
                        <Table.Th>Location</Table.Th>
                        <Table.Th>Capacity</Table.Th>
                        <Table.Th>Booked</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {slots.length === 0 ? (
                        <Table.Tr>
                            <Table.Td colSpan={4} style={{ textAlign: 'center' }}>
                                No slots yet
                            </Table.Td>
                        </Table.Tr>
                    ) : (
                        slots.map((slot) => (
                            <Table.Tr key={slot.id}>
                                <Table.Td>{dayjs(slot.dateTime).format('YYYY-MM-DD HH:mm')}</Table.Td>
                                <Table.Td>{slot.location}</Table.Td>
                                <Table.Td>{slot.capacity}</Table.Td>
                                <Table.Td>{slot.bookedCount}</Table.Td>
                            </Table.Tr>
                        ))
                    )}
                </Table.Tbody>
            </Table>
        </Container>
    );
}
