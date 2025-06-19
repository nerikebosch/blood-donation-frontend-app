"use client";

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { useState, useMemo } from "react";
import {
    Box, Select, Button, Text, Paper
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { LOCATION_OPTIONS } from '@/constants/locations';
import dayjs from "dayjs"; // Adjust path as needed

export function AppointmentBooking({ slots, onBooked }) {
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const filteredSlots = useMemo(() => {
        if (!selectedLocation || !selectedDate) return [];


        return slots.filter(slot => {
            return (
                slot.location === selectedLocation &&
                dayjs(slot.dateTime).isSame(dayjs(selectedDate), 'day')
            );
        });
    }, [slots, selectedLocation, selectedDate]);

    console.log("Filtered slots:", filteredSlots);

    const slotOptions = filteredSlots.map(slot => ({
        value: slot.id.toString(),
        label: new Date(slot.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    const handleBook = async () => {
        if (!selectedSlotId) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            console.log("token: "+token);
            const res = await fetch('http://localhost:8080/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    slotId: parseInt(selectedSlotId),
                    userId: 12
                }),
            });

            console.log("slotid: "+ selectedSlotId);
            console.log("value"+res)

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }

            alert('Appointment booked successfully!');
            setSelectedLocation(null);
            setSelectedDate(null);
            setSelectedSlotId(null);
            onBooked(); // refresh list
        } catch (err) {
            console.error('Error booking appointment:', err);
            alert('Booking failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper p="md" withBorder radius="md">
            <Select
                label="Select Donation Location"
                placeholder="Choose a location"
                data={LOCATION_OPTIONS}
                value={selectedLocation}
                onChange={setSelectedLocation}
                mb="md"
            />

            <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                minDate={new Date()}
                label="Select a Date"
                placeholder="Pick a date"
                mb="md"
            />

            {selectedLocation && selectedDate && (
                <Select
                    label="Available Time Slots"
                    placeholder={slotOptions.length ? "Choose a time" : "No available slots"}
                    data={slotOptions}
                    value={selectedSlotId}
                    onChange={setSelectedSlotId}
                    mb="md"
                />
            )}

            <Button
                mt="lg"
                color="red"
                disabled={!selectedSlotId || loading}
                loading={loading}
                onClick={handleBook}
            >
                Book Appointment
            </Button>
        </Paper>
    );
}
