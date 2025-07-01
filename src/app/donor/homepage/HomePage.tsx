"use client"

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/carousel/styles.css';

import { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { Carousel } from '@mantine/carousel';

import {
    Box,
    Button,
    Image,
    Title,
    SimpleGrid,
    Text,
    Card,
} from '@mantine/core';
import Link from "next/link";


export function HomePage() {

    // delay for the carousel
    const autoplay = useRef(Autoplay({delay: 3000}));

    return (
        <><><Box pb={10}>


        </Box><Box p="lg" pt="xl">
            <Carousel
            withIndicators
            height={400}
            plugins={[autoplay.current]}
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
        >
            <Carousel.Slide>
                <Box
                    pos="relative"
                    h={400}
                    style={{
                        backgroundImage: 'url("/two_people_heart_donate.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: 12
                    }}
                >
                    {/* Optional dark overlay */}
                    <Box
                        pos="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        style={{backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: 12}}/>

                    {/* Foreground content */}
                    <Box
                        pos="relative"
                        p="lg"
                        h="100%"
                        style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'white'}}
                    >
                        <Title order={2} c="white" mb="sm">
                            Why You Should Donate
                        </Title>
                        <Text mb="md" size="md" c="white">
                            Donating blood helps save lives, supports patients in emergencies, and improves your own
                            health.
                            Be the reason someone gets a second chance.
                        </Text>
                        <Button variant="white" color="red" w="fit-content">
                            How You Can Help
                        </Button>
                    </Box>
                </Box>
            </Carousel.Slide>


            <Carousel.Slide>
                <Box
                    pos="relative"
                    h={400}
                    style={{
                        backgroundImage: 'url("/man_getting_ready_for_donation.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: 12,
                    }}
                >
                    <Box
                        pos="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        style={{backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: 12}}/>
                    <Box
                        pos="relative"
                        p="lg"
                        h="100%"
                        style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'white'}}
                    >
                        <Title order={2} c="white" mb="sm">
                            How Can You Start Today?
                        </Title>
                        <Text mb="md" size="md" c="white">
                            It's quick and easy to begin. Check your eligibility, book your first appointment, and join
                            thousands of life-saving donors.
                        </Text>
                        <Link href="/donor/appointment">
                            <Button variant="white" color="red" w="fit-content">
                                Book an Appointment
                            </Button>
                        </Link>
                    </Box>
                </Box>
            </Carousel.Slide>

            </Carousel></Box></>
            <Box p="lg" pt="xl">
                <SimpleGrid
                    cols={3}
                    spacing="lg"
                >
                    <Card shadow="sm" radius="md" withBorder h="100%">
                        <Card.Section>
                            <Box
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '1rem',
                                }}
                            >
                                <Image
                                    w={250}
                                    h={250}
                                    src="/where_can_i_donate.png"
                                    alt="where can i donate"
                                />
                            </Box>
                        </Card.Section>
                        <Text size="sm" color="dimmed" mt="sm">
                            Find the nearest donation center and check availability.
                        </Text>
                        <Button variant="light" color="red" radius="md" mt="md">
                            Where can I donate?
                        </Button>
                    </Card>

                    <Card shadow="sm" radius="md" withBorder h="100%">
                        <Card.Section>
                            <Box
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '1rem',
                                }}
                            >
                                <Image
                                    w={250}
                                    h={250}
                                    src="/prepare_to_donate.png"
                                    alt="prepare to donate"
                                />
                            </Box>
                        </Card.Section>
                        <Text size="sm" color="dimmed" mt="sm">
                            Learn how to prepare before your donation visit.
                        </Text>
                        <Button variant="light" color="red" radius="md" mt="md">
                            Prepare to Donate
                        </Button>
                    </Card>

                    <Card shadow="sm" radius="md" withBorder h="100%">
                        <Card.Section>
                            <Box
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '1rem',
                                }}
                            >
                                <Image
                                    w={250}
                                    h={250}
                                    src="/aftercare_info.png"
                                    alt="aftercare_info"
                                />
                            </Box>
                        </Card.Section>
                        <Text size="sm" color="dimmed" mt="sm">
                            Understand what happens after you donate blood.
                        </Text>
                        <Button variant="light" color="red" radius="md" mt="md">
                            Aftercare Info
                        </Button>
                    </Card>
                </SimpleGrid>
            </Box>
        </>
    );
}
