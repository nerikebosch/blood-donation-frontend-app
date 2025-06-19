"use client"

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/carousel/styles.css';

import {
    IconBell,
    IconCalendar,
    IconChevronDown,
    IconDroplet,
    IconHelpCircle,
    IconUser,
    IconVaccine,
} from '@tabler/icons-react';


import { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { Carousel } from '@mantine/carousel';

import {
    Anchor,
    Box,
    Burger,
    Button,
    Center,
    Collapse,
    Divider,
    Drawer,
    Group,
    Image,
    HoverCard,
    ScrollArea,
    Title,
    SimpleGrid,
    Text,
    ThemeIcon,
    UnstyledButton,
    useMantineTheme, Card,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from '../../styles/HomePage.module.css';
import Link from "next/link";

const donorMenuData = [
    {
        icon: IconCalendar,
        title: 'Appointments',
        description: 'View, create, or track appointment status',
        href: '/appointment',
    },
    {
        icon: IconVaccine,
        title: 'Medical Reports',
        description: 'View past medical test results',
        href: '/medical-reports',
    },
    {
        icon: IconUser,
        title: 'Profile',
        description: 'View or update personal and eligibility info',
        href: '/profile',
    },
    {
        icon: IconDroplet,
        title: 'Donation History',
        description: 'Track all successful donations',
        href: '/donation-history',
    },
    {
        icon: IconBell,
        title: 'Notifications',
        description: 'Appointment updates, eligibility reminders',
        href: '/notifications',
    },
    {
        icon: IconHelpCircle,
        title: 'FAQ / Learn More',
        description: 'Info about donation process & safety',
        href: '/faq',
    },
];

export function HomePage() {
    const [drawerOpened, {toggle: toggleDrawer, close: closeDrawer}] = useDisclosure(false);
    const [linksOpened, {toggle: toggleLinks}] = useDisclosure(false);
    const theme = useMantineTheme();

    // delay for the carousel
    const autoplay = useRef(Autoplay({delay: 3000}));

    const links = donorMenuData.map((item) => (
        <Link href={item.href} key={item.title} className={classes.subLink}>
            <UnstyledButton className={classes.subLink} key={item.title}>
                <Group wrap="nowrap" align="flex-start">
                    <ThemeIcon size={34} variant="default" radius="md">
                        <item.icon size={22} color={theme.colors.red[6]}/>
                    </ThemeIcon>
                    <div>
                        <Text size="sm" fw={500}>
                            {item.title}
                        </Text>
                        <Text size="xs" c="dimmed">
                            {item.description}
                        </Text>
                    </div>
                </Group>
            </UnstyledButton>
        </Link>

    ));

    return (
        <><><Box pb={10}>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">

                    <Link href="/homepage">
                        <Group align="center" gap="sm" wrap="nowrap">
                            <Image
                                src="/logo_blood_donation.png"
                                alt="Red Hope Logo"
                                width={40}
                                height={40}
                                fit="contain"
                                style={{display: 'block'}}/>
                            <Title order={2} m={0} fw={600} style={{whiteSpace: 'nowrap'}}>
                                Red Hope
                            </Title>
                        </Group>
                    </Link>

                    <Group h="100%" gap={0} visibleFrom="sm">
                        <a href="#" className={classes.link}>
                            Home
                        </a>
                        <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
                            <HoverCard.Target>
                                <a href="#" className={classes.link}>
                                    <Center inline>
                                        <Box component="span" mr={5}>
                                            Menu
                                        </Box>
                                        <IconChevronDown size={16} color={theme.colors.red[6]}/>
                                    </Center>
                                </a>
                            </HoverCard.Target>

                            <HoverCard.Dropdown style={{overflow: 'hidden'}}>
                                <Group justify="space-between" px="md">
                                    <Text fw={500}>Donor Features</Text>
                                    <Anchor href="#" fz="xs">
                                        View all
                                    </Anchor>
                                </Group>

                                <Divider my="sm"/>

                                <SimpleGrid cols={2} spacing={0}>
                                    {links}
                                </SimpleGrid>

                                <div className={classes.dropdownFooter}>
                                    <Group justify="space-between">
                                        <div>
                                            <Text fw={500} fz="sm">
                                                Ready to Donate?
                                            </Text>
                                            <Text size="xs" c="dimmed">
                                                Check your eligibility or book an appointment.
                                            </Text>
                                        </div>
                                        <Button variant="default">Get Started</Button>
                                    </Group>
                                </div>
                            </HoverCard.Dropdown>
                        </HoverCard>
                    </Group>

                    <Group visibleFrom="sm">
                        <Link href="/loginpage">
                            <Button variant="default">Login</Button>
                        </Link>
                    </Group>

                    <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm"/>
                </Group>
            </header>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Navigation"
                hiddenFrom="sm"
                zIndex={1000000}
            >
                <ScrollArea h="calc(100vh - 80px)" mx="-md">
                    <Divider my="sm"/>

                    <a href="#" className={classes.link}>
                        Home
                    </a>
                    <UnstyledButton className={classes.link} onClick={toggleLinks}>
                        <Center inline>
                            <Box component="span" mr={5}>
                                Menu
                            </Box>
                            <IconChevronDown size={16} color={theme.colors.red[6]}/>
                        </Center>
                    </UnstyledButton>
                    <Collapse in={linksOpened}>{links}</Collapse>

                    <Divider my="sm"/>

                    <Group justify="center" grow pb="xl" px="md">
                        <Button variant="default">
                            <Link href="/loginpage">
                                Login
                            </Link>
                        </Button>
                    </Group>
                </ScrollArea>
            </Drawer>
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
                        <Button variant="white" color="red" w="fit-content">
                            Book an Appointment
                        </Button>
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
