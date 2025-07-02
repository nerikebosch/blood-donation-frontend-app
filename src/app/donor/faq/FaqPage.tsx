"use client";

import { Box, Title, Text, Container, Divider, List, Paper } from "@mantine/core";
import { LOCATION_OPTIONS } from "@/constants/locations";

export function FaqPage() {
    return (
        <Container size="md" py="xl">
            <Title >
                Learn More
            </Title>
            {/* Section: How You Can Help */}
            <Box id="how-you-can-help" mb="xl">
                <Title order={2} mb="sm">How You Can Help</Title>
                <Text mb="md">
                    Donating blood is one of the most impactful actions you can take. Each donation can save up to three lives.
                    Your contribution helps:
                </Text>
                <List spacing="xs" withPadding>
                    <List.Item>Support patients in surgeries, cancer treatments, and trauma cases.</List.Item>
                    <List.Item>Maintain a steady blood supply during emergencies and natural disasters.</List.Item>
                    <List.Item>Improve your own health by stimulating new blood cell production.</List.Item>
                </List>
                <Text mt="md">
                    Whether it’s your first time or your fiftieth, every donation counts. Be the reason someone gets a second chance.
                </Text>
            </Box>

            <Divider my="xl" />

            {/* Section: How to Prepare */}
            <Box id="prepare-to-donate" mb="xl">
                <Title order={2} mb="sm">Prepare to Donate</Title>
                <Text mb="md">
                    Proper preparation can help ensure a successful and comfortable donation experience. Here's how to get ready:
                </Text>
                <List spacing="xs" withPadding>
                    <List.Item>Get a good night’s sleep the night before your appointment.</List.Item>
                    <List.Item>Eat a healthy, iron-rich meal (avoid fatty foods) and stay well-hydrated.</List.Item>
                    <List.Item>Bring a valid photo ID and your donor card, if you have one.</List.Item>
                    <List.Item>Wear comfortable clothes with sleeves that roll up easily.</List.Item>
                </List>
            </Box>

            <Divider my="xl" />

            {/* Section: Aftercare Info */}
            <Box id="aftercare-info" mb="xl">
                <Title order={2} mb="sm">Aftercare Information</Title>
                <Text mb="md">
                    After donating blood, it's important to take care of yourself so you can recover quickly:
                </Text>
                <List spacing="xs" withPadding>
                    <List.Item>Relax for 10-15 minutes after donation. Enjoy a snack and drink provided.</List.Item>
                    <List.Item>Avoid strenuous activity or heavy lifting for the rest of the day.</List.Item>
                    <List.Item>Drink plenty of fluids and eat a full meal within a few hours.</List.Item>
                    <List.Item>If you feel dizzy or lightheaded, sit or lie down until it passes.</List.Item>
                </List>
                <Text mt="md">
                    Your body will replace the fluids within 24 hours and red blood cells within a few weeks.
                </Text>
            </Box>

            <Divider my="xl" />

            {/* Section: Where Can I Donate */}
            <Box id="where-can-i-donate" mb="xl">
                <Title order={2} mb="sm">Where Can I Donate?</Title>
                <Text mb="md">
                    Here are our current donation locations:
                </Text>
                <List spacing="xs" withPadding>
                    {LOCATION_OPTIONS.map((loc) => (
                        <List.Item key={loc.value}>{loc.label}</List.Item>
                    ))}
                </List>
                <Text mt="md">
                    You can check appointment availability on the <strong>Book an Appointment</strong> page.
                </Text>
            </Box>
        </Container>
    );
}
