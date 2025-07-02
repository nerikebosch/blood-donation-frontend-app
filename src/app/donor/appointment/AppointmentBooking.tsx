"use client";

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import {useState, useMemo, useEffect} from "react";
import {
    Box,
    Button,
    Text,
    Paper,
    Container,
    SimpleGrid,
    Grid,
    Card,
    Title,
    Group
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import dayjs from "dayjs";
import { useAuth } from "@/lib/auth";

export function AppointmentBooking({ slots, onBooked }) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [loadingSlotId, setLoadingSlotId] = useState<number | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/user/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error(await res.text());
                const data = await res.json();
                setUserId(data.id); // 👈 Set userId from response
            } catch (err) {
                console.error("Failed to fetch user info:", err);
            }
        };
        fetchUser();
    }, [token]);

    const filteredSlots = useMemo(() => {
        if (!selectedDate) return [];
        return slots.filter(slot =>
            dayjs(slot.dateTime).isSame(dayjs(selectedDate), 'day')
        );
    }, [slots, selectedDate]);

    const handleBook = async (slotId: number) => {
        setLoadingSlotId(slotId);
        try {
            const res = await fetch('http://localhost:8080/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    slotId,
                    userId
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }

            alert('Appointment booked successfully!');
            setSelectedDate(null);
            onBooked();
        } catch (err) {
            console.error('Error booking appointment:', err);
            alert('Booking failed.');
        } finally {
            setLoadingSlotId(null);
        }
    };

    return (
        <Paper p="md" withBorder radius="md">
            <Container>
                <Grid>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <DatePicker
                            value={selectedDate}
                            onChange={setSelectedDate}
                            minDate={new Date()}
                            label="Select a Date"
                            placeholder="Pick a date"
                            mb="md"
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        {selectedDate && (
                            <>
                                <Title order={4} mb="sm">Available Slots</Title>
                                {filteredSlots.length === 0 && (
                                    <Text>No slots available for this date.</Text>
                                )}
                                <SimpleGrid cols={1} spacing="sm">
                                    {filteredSlots.map(slot => (
                                        <Card key={slot.id} shadow="sm" padding="md" radius="md" withBorder>
                                            <Group justify="space-between" align="center">
                                                <Box>
                                                    <Text fw={600}>{slot.location}</Text>
                                                    <Text size="sm" c="dimmed">
                                                        {new Date(slot.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </Text>
                                                </Box>
                                                <Button
                                                    size="xs"
                                                    color="red"
                                                    onClick={() => handleBook(slot.id)}
                                                    loading={loadingSlotId === slot.id}
                                                >
                                                    Book
                                                </Button>
                                            </Group>
                                        </Card>
                                    ))}
                                </SimpleGrid>
                            </>
                        )}
                    </Grid.Col>
                </Grid>
            </Container>
        </Paper>
    );
}
