"use client";

import {
    TextInput,
    Paper,
    Title,
    Stack,
    Button,
    Group,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function DonorProfile() {
    const { id } = useParams();
    const [editable, setEditable] = useState(false);

    const [user, setUser] = useState({
        name: "",
        surname: "",
        email: "",
    });

    const [profile, setProfile] = useState({
        bloodType: "",
        gender: "",
        ethnicity: "",
        address: "",
        dateOfBirth: "",
        lastDonationDate: "",
    });

    const { token } = useAuth();

    useEffect(() => {


        fetch(`http://localhost:8080/api/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then(setUser);

        fetch(`http://localhost:8080/api/donor-profiles/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then(setProfile);
    }, [id]);

    const handleUserChange = (field: string, value: string) => {
        setUser((prev) => ({ ...prev, [field]: value }));
    };

    const handleProfileChange = (field: string, value: string) => {
        setProfile((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {

        await fetch(`http://localhost:8080/api/user/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(user),
        });

        await fetch(`http://localhost:8080/api/donor-profiles/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(profile),
        });

        alert("Profile updated");
        setEditable(false);
    };

    return (
        <Paper p="lg" maw={800} mx="auto">
            <Group position="apart" mb="md">
                <Title order={3}>Donor Profile</Title>
                <Button onClick={() => setEditable((e) => !e)}>
                    {editable ? "Cancel" : "Edit"}
                </Button>
            </Group>
            <Group align="start" grow>
                <Stack>
                    <TextInput label="Name" value={user.name} onChange={(e) => handleUserChange("name", e.currentTarget.value)} disabled={!editable} />
                    <TextInput label="Surname" value={user.surname} onChange={(e) => handleUserChange("surname", e.currentTarget.value)} disabled={!editable} />
                    <TextInput label="Email" value={user.email} onChange={(e) => handleUserChange("email", e.currentTarget.value)} disabled={!editable} />
                    <TextInput label="Address" value={profile.address} onChange={(e) => handleProfileChange("address", e.currentTarget.value)} disabled={!editable} />
                </Stack>
                <Stack>
                    <TextInput label="Blood Type" value={profile.bloodType} onChange={(e) => handleProfileChange("bloodType", e.currentTarget.value)} disabled={!editable} />
                    <TextInput label="Gender" value={profile.gender} onChange={(e) => handleProfileChange("gender", e.currentTarget.value)} disabled={!editable} />
                    <TextInput label="Ethnicity" value={profile.ethnicity} onChange={(e) => handleProfileChange("ethnicity", e.currentTarget.value)} disabled={!editable} />
                    <TextInput label="DOB" value={profile.dateOfBirth} onChange={(e) => handleProfileChange("dateOfBirth", e.currentTarget.value)} disabled={!editable} />
                    <TextInput label="Last Donation Date" value={profile.lastDonationDate} onChange={(e) => handleProfileChange("lastDonationDate", e.currentTarget.value)} disabled={!editable} />
                </Stack>
            </Group>
            {editable && (
                <Button mt="md" onClick={handleSave}>
                    Save Changes
                </Button>
            )}
        </Paper>
    );
}
