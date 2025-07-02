"use client";

import {
    IconBell,
    IconCalendar,
    IconChevronDown,
    IconDroplet,
    IconHelpCircle,
    IconUser,
    IconVaccine,
} from '@tabler/icons-react';

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
    HoverCard,
    ScrollArea,
    SimpleGrid,
    Text,
    ThemeIcon,
    Title,
    UnstyledButton,
    useMantineTheme,
    Image,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import classes from '../../styles/HomePage.module.css';
import {useRouter} from "next/navigation";

const donorMenuData = [
    {
        icon: IconCalendar,
        title: 'Appointments',
        description: 'View, create, or track appointment status',
        href: '/donor/appointment',
    },
    {
        icon: IconVaccine,
        title: 'Medical Reports',
        description: 'View past medical test results',
        href: '/donor/medical-reports',
    },
    {
        icon: IconUser,
        title: 'Profile',
        description: 'View or update personal and eligibility info',
        href: '/donor/profile',
    },
    {
        icon: IconDroplet,
        title: 'Donation History',
        description: 'Track all successful donations',
        href: '/donor/donation-history',
    },
    {
        icon: IconBell,
        title: 'Notifications',
        description: 'Appointment updates, eligibility reminders',
        href: '/donor/notifications',
    },
    {
        icon: IconHelpCircle,
        title: 'FAQ / Learn More',
        description: 'Info about donation process & safety',
        href: '/donor/faq',
    },
];

export default function DonorHeader() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
    const theme = useMantineTheme();

    const { logout } = useAuth();
    const router = useRouter();

    const links = donorMenuData.map((item) => (
        <Link href={item.href} key={item.title} className={classes.subLink}>
            <UnstyledButton className={classes.subLink}>
                <Group wrap="nowrap" align="flex-start">
                    <ThemeIcon size={34} variant="default" radius="md">
                        <item.icon size={22} color={theme.colors.red[6]} />
                    </ThemeIcon>
                    <div>
                        <Text size="sm" fw={500}>{item.title}</Text>
                        <Text size="xs" c="dimmed">{item.description}</Text>
                    </div>
                </Group>
            </UnstyledButton>
        </Link>
    ));

    return (
        <Box pb={10}>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">
                    <Link href="/donor/homepage">
                        <Group align="center" gap="sm" wrap="nowrap">
                            <Image
                                src="/logo_blood_donation.png"
                                alt="Red Hope Logo"
                                width={40}
                                height={40}
                                fit="contain"
                                style={{ display: 'block' }}
                            />
                            <Title order={2} m={0} fw={600} style={{ whiteSpace: 'nowrap' }}>
                                Red Hope
                            </Title>
                        </Group>
                    </Link>

                    <Group h="100%" gap={0} visibleFrom="sm">
                        <Link href="/donor/homepage" className={classes.link}>Home</Link>
                        <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
                            <HoverCard.Target>
                                <Link href="#" className={classes.link}>
                                    <Center inline>
                                        <Box component="span" mr={5}>Menu</Box>
                                        <IconChevronDown size={16} color={theme.colors.red[6]} />
                                    </Center>
                                </Link>
                            </HoverCard.Target>
                            <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                                <Group justify="space-between" px="md">
                                    <Text fw={500}>Donor Features</Text>
                                    <Anchor href="#" fz="xs">View all</Anchor>
                                </Group>
                                <Divider my="sm" />
                                <SimpleGrid cols={2} spacing={0}>{links}</SimpleGrid>
                                <div className={classes.dropdownFooter}>
                                    <Group justify="space-between">
                                        <div>
                                            <Text fw={500} fz="sm">Ready to Donate?</Text>
                                            <Text size="xs" c="dimmed">Check your eligibility or book an appointment.</Text>
                                        </div>
                                        <Button variant="default">Get Started</Button>
                                    </Group>
                                </div>
                            </HoverCard.Dropdown>
                        </HoverCard>
                    </Group>

                    <Group visibleFrom="sm">
                        <Button
                            variant="default"
                            onClick={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("role");
                                window.location.href = "/loginpage";
                            }}
                        >
                            Logout
                        </Button>
                    </Group>

                    <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
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
                    <Divider my="sm" />
                    <Link href="#" className={classes.link}>Home</Link>
                    <UnstyledButton className={classes.link} onClick={toggleLinks}>
                        <Center inline>
                            <Box component="span" mr={5}>Menu</Box>
                            <IconChevronDown size={16} color={theme.colors.red[6]} />
                        </Center>
                    </UnstyledButton>
                    <Collapse in={linksOpened}>{links}</Collapse>
                    <Divider my="sm" />
                    <Group justify="center" grow pb="xl" px="md">
                        <Button variant="default" onClick={() => {
                            logout(); // clears token and role
                            router.push("/loginpage");
                        }}>
                            Logout
                        </Button>
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box>
    );
}
