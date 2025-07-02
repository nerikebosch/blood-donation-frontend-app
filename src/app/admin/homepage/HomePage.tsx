'use client';

import {
    Title,
    Grid,
    Card,
    Text,
    Container,
    SimpleGrid,
    Image,
    Divider,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';

interface BloodDonationStat {
    bloodType: string;
    volume: number;
}

interface AdminStats {
    totalPatients: number;
    appointmentsToday: number;
    totalAppointments: number;
    completedAppointments: number;
    bloodDonations: BloodDonationStat[];
}

export default function AdminHomePage() {
    const { token } = useAuth();
    const [stats, setStats] = useState<AdminStats | null>(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/admin/stats', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then(setStats)
            .catch((err) => console.error('Failed to load admin stats:', err));
    }, []);

    return (
        <Container>
            <Title order={2} my="md">Admin Dashboard</Title>

            {stats && (
                <>
                    {/* Top Stats */}
                    <SimpleGrid cols={4} spacing="lg" mb="xl">
                        <Card shadow="sm" withBorder>
                            <Text size="lg" fw={700}>Patients</Text>
                            <Text size="xl">{stats.totalPatients}</Text>
                        </Card>
                        <Card shadow="sm" withBorder>
                            <Text size="lg" fw={700}>Appointments Today</Text>
                            <Text size="xl">{stats.appointmentsToday}</Text>
                        </Card>
                        <Card shadow="sm" withBorder>
                            <Text size="lg" fw={700}>All Appointments</Text>
                            <Text size="xl">{stats.totalAppointments}</Text>
                        </Card>
                        <Card shadow="sm" withBorder>
                            <Text size="lg" fw={700}>Completed Donations</Text>
                            <Text size="xl">{stats.completedAppointments}</Text>
                        </Card>
                    </SimpleGrid>

                    <Divider my="lg" label="Blood Type Donations" labelPosition="center" />

                    {/* Blood Type Cards */}
                    <Grid gutter="lg">
                        {stats.bloodDonations.map((item) => {
                            const imageName = item.bloodType
                                .replace('+', 'plus')
                                .replace('-', 'minus')
                                .replace(/\s/g, '') // remove spaces

                            const imagePath = `/${imageName}.png`;

                            return (
                                <Grid.Col span={{ base: 6, md: 3 }} key={item.bloodType}>
                                    <Card withBorder shadow="sm">
                                        <Image src={imagePath} alt={item.bloodType} fit="contain" height={100} />
                                        <Text size="xl" ta="center">{item.volume} ml donated</Text>
                                    </Card>
                                </Grid.Col>
                            );
                        })}
                    </Grid>
                </>
            )}
        </Container>
    );
}
