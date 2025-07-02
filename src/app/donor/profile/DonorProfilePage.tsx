"use client";

import {
    TextInput,
    Paper,
    Button,
    Title,
    Stack,
    Loader,
    Center,
    Grid,
    Card,
    Select,
    Text,
    Image,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

interface User {
    id: number;
    name: string;
    surname: string;
    email: string;
}

interface DonorProfile {
    userId: number;
    ethnicity: string;
    bloodType: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    lastDonationDate: string;
}

const dateInputStyles = {
    dropdown: {
        backgroundColor: 'white',
        border: '1px solid #ced4da',
        maxWidth: '300px',
        width: 'auto',
    },
    calendar: {
        maxWidth: '280px',
    },
    calendarHeader: {
        maxWidth: '280px',
        marginBottom: '10px',
        color: 'black',
        alignSelf: 'center',
    },
    calendarHeaderControl: {
        width: '30px',
        height: '30px',
        fontSize: '16px',
        color: 'black',
    },
    calendarHeaderLevel: {
        fontSize: '16px',
        fontWeight: 500,
        color: 'black',
    },
    day: {
        color: 'black',
        fontSize: '14px',
        width: '35px',
        height: '35px',
    },
    weekday: {
        color: '#666',
        fontSize: '12px',
        fontWeight: 600,
    },
};

export default function DonorProfilePage() {
    const { token } = useAuth();

    const [user, setUser] = useState<User | null>(null);
    const [donorProfile, setDonorProfile] = useState<DonorProfile | null>(null);
    const [form, setForm] = useState({ name: "", surname: "", email: "" });
    const [donorForm, setDonorForm] = useState<DonorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [bloodAmount, setBloodAmount] = useState<number>(0);

    useEffect(() => {
        (async () => {
            try {
                const userRes = await fetch("http://localhost:8080/api/user/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userData: User = await userRes.json();
                setUser(userData);
                setForm({
                    name: userData.name,
                    surname: userData.surname,
                    email: userData.email,
                });

                const profileRes = await fetch("http://localhost:8080/api/donor-profiles/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const donorData: DonorProfile = await profileRes.json();
                setDonorProfile(donorData);
                setDonorForm(donorData);

                const appointmentsRes = await fetch("http://localhost:8080/api/appointments/mine", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const appointments = await appointmentsRes.json();
                const completed = appointments.filter((a: any) => a.status === "COMPLETED");
                setBloodAmount(completed.length * 500);
            } catch (err) {
                console.error("Failed loading data", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        await fetch("http://localhost:8080/api/user/me", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(form),
        });

        if (donorForm) {
            await fetch("http://localhost:8080/api/donor-profiles/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(donorForm),
            });
        }

        alert("Profile saved!");
        setSaving(false);
    };

    const donationMessage = () => {
        if (bloodAmount === 0) return "Your journey as a lifesaver begins today!";
        if (bloodAmount < 2000) return "You're making a real difference ❤️";
        if (bloodAmount < 5000) return "You're a blood hero 🦸‍♀️🦸‍♂️";
        return "You're a legend. Lives are saved because of you! 🏆";
    };

    if (loading) {
        return (
            <Center style={{ height: "100vh" }}>
                <Loader size="lg" />
            </Center>
        );
    }

    return (
        <Stack p="lg">
            <Grid gutter="xl">
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card shadow="sm" p="lg" radius="md" withBorder>
                        <Title order={3} mb="md">User Profile</Title>
                        <Stack>
                            <TextInput
                                label="First Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.currentTarget.value })}
                            />
                            <TextInput
                                label="Surname"
                                value={form.surname}
                                onChange={(e) => setForm({ ...form, surname: e.currentTarget.value })}
                            />
                            <TextInput
                                label="Email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.currentTarget.value })}
                            />
                        </Stack>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card shadow="sm" p="lg" radius="md" withBorder>
                        <Title order={3} mb="md">Donor Profile</Title>
                        <Stack>
                            <Select
                                label="Blood Type"
                                data={['A+', 'A-', 'O+', 'O-', 'B+', 'B-', 'AB+', 'AB-']}
                                value={donorForm?.bloodType}
                                onChange={(val) => setDonorForm({ ...donorForm!, bloodType: val || "" })}
                            />
                            <Select
                                label="Ethnicity"
                                data={['White', 'Asian', 'Black / African', 'Mixed', 'Other', 'Prefer not to say']}
                                value={donorForm?.ethnicity}
                                onChange={(val) => setDonorForm({ ...donorForm!, ethnicity: val || "" })}
                            />
                            <Select
                                label="Gender"
                                data={['Male', 'Female', 'Other']}
                                value={donorForm?.gender}
                                onChange={(val) => setDonorForm({ ...donorForm!, gender: val || "" })}
                            />
                            <DateInput
                                label="Date of Birth"
                                value={donorForm?.dateOfBirth ? new Date(donorForm.dateOfBirth) : null}
                                onChange={(val) =>
                                    setDonorForm({ ...donorForm!, dateOfBirth: val?.toString().split("T")[0] || "" })
                                }
                                styles={dateInputStyles}
                            />
                            <TextInput
                                label="Address"
                                value={donorForm?.address || ""}
                                onChange={(e) => setDonorForm({ ...donorForm!, address: e.currentTarget.value })}
                            />
                            <DateInput
                                label="Last Donation Date"
                                value={donorForm?.lastDonationDate ? new Date(donorForm.lastDonationDate) : null}
                                onChange={(val) =>
                                    setDonorForm({
                                        ...donorForm!,
                                        lastDonationDate: val?.toString().split("T")[0] || "",
                                    })
                                }
                                styles={dateInputStyles}
                            />
                        </Stack>
                    </Card>
                </Grid.Col>
            </Grid>

            <Card shadow="md" radius="md" p="xl" withBorder>
                <Grid align="center">
                    <Grid.Col span={{ base: 12, md: 3 }}>
                        <Image
                            src="/heart_donate.jpg"
                            alt="Blood donation"
                            width={100}
                            fit="contain"
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 9 }}>
                        <Title order={3}>You've donated:</Title>
                        <Text size="xl" fw={700} mt="sm">{bloodAmount} ml</Text>
                        <Text c="dimmed" mt="xs">{donationMessage()}</Text>
                    </Grid.Col>
                </Grid>
            </Card>

            <Button mt="lg" onClick={handleSave} loading={saving} fullWidth>
                Save Changes
            </Button>
        </Stack>
    );
}
