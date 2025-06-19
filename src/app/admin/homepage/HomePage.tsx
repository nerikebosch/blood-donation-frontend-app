'use client';

import '@mantine/core/styles.css';
import {
    IconBell,
    IconCalendar,
    IconDroplet,
    IconUser,
    IconVaccine,
    IconClipboardText,
    IconClock,
    IconChartBar,
    IconSettings,
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
    Image,
    ScrollArea,
    SimpleGrid,
    Text,
    ThemeIcon,
    Title,
    UnstyledButton,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from '../../../styles/HomePage.module.css';
import Link from 'next/link';

const adminMenuData = [
    { icon: IconCalendar, title: 'Manage Appointments', description: 'View, approve, reject appointments', href: '/admin/appointments' },
    { icon: IconClipboardText, title: 'Manage Donors', description: 'View donor list and their details', href: '/admin/donors' },
    { icon: IconVaccine, title: 'Medical Tests', description: 'Add or update test results for donors', href: '/admin/tests' },
    { icon: IconClock, title: 'Donation Slots', description: 'Create or manage available time slots', href: '/admin/donationslot' },
    { icon: IconChartBar, title: 'Reports & Stats', description: 'View analytics on donations, appointments', href: '/admin/reports' },
    { icon: IconBell, title: 'Notifications', description: 'See donor submissions needing action', href: '/admin/notifications' },
    { icon: IconSettings, title: 'Settings', description: 'Admin account settings, log out', href: '/admin/settings' },
];

export default function AdminHomePage() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
    const theme = useMantineTheme();

    const links = adminMenuData.map((item) => (
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
                    <Link href="/admin">
                        <Group align="center" gap="sm" wrap="nowrap">
                            <Image src="/logo_blood_donation.png" alt="Red Hope Logo" width={40} height={40} fit="contain" />
                            <Title order={2} fw={600} style={{ whiteSpace: 'nowrap' }}>Red Hope Admin</Title>
                        </Group>
                    </Link>

                    <Group h="100%" gap={0} visibleFrom="sm">
                        <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
                            <HoverCard.Target>
                                <a href="#" className={classes.link}>
                                    <Center inline>
                                        <Box component="span" mr={5}>Menu</Box>
                                    </Center>
                                </a>
                            </HoverCard.Target>

                            <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                                <Group justify="space-between" px="md">
                                    <Text fw={500}>Admin Tools</Text>
                                </Group>
                                <Divider my="sm" />
                                <SimpleGrid cols={2} spacing={0}>{links}</SimpleGrid>
                            </HoverCard.Dropdown>
                        </HoverCard>
                    </Group>

                    <Group visibleFrom="sm">
                        <Link href="/logout">
                            <Button variant="default">Logout</Button>
                        </Link>
                    </Group>

                    <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
                </Group>
            </header>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Admin Navigation"
                hiddenFrom="sm"
                zIndex={1000000}
            >
                <ScrollArea h="calc(100vh - 80px)" mx="-md">
                    <Divider my="sm" />

                    <UnstyledButton className={classes.link} onClick={toggleLinks}>
                        <Center inline>
                            <Box component="span" mr={5}>Menu</Box>
                        </Center>
                    </UnstyledButton>
                    <Collapse in={linksOpened}>{links}</Collapse>

                    <Divider my="sm" />

                    <Group justify="center" grow pb="xl" px="md">
                        <Link href="/logout">
                            <Button variant="default">Logout</Button>
                        </Link>
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box>
    );
}
