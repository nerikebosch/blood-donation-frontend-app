"use client";

import {
    Table,
    Button,
    Modal,
    Text,
    Title,
    Container,
    Anchor,
    Group,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

interface Donor {
    userId: number;
    name: string;
    surname: string;
    email: string;
}

export default function AdminDonorList() {
    const [donors, setDonors] = useState<Donor[]>([]);
    const [deleteTarget, setDeleteTarget] = useState<Donor | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const { token } = useAuth();

    useEffect(() => {
        fetch("http://localhost:8080/api/donor-profiles", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then(async (profiles) => {
                const results: Donor[] = await Promise.all(
                    profiles.map(async (profile: any) => {
                        const res = await fetch(`http://localhost:8080/api/user/${profile.userId}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        const user = await res.json();
                        return {
                            userId: profile.userId,
                            name: user.name,
                            surname: user.surname,
                            email: user.email,
                        };
                    })
                );
                setDonors(results);
            });
    }, []);

    const handleDelete = async () => {
        if (!deleteTarget) return;

        try {
            await fetch(`http://localhost:8080/api/user/${deleteTarget.userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            setDonors((prev) => prev.filter((d) => d.userId !== deleteTarget.userId));
        } catch (error) {
            console.error("Failed to delete user:", error);
        } finally {
            setIsModalOpen(false);
            setDeleteTarget(null);
        }
    };

    const rows = donors.map((donor) => (
        <Table.Tr key={donor.userId}>
            <Table.Td>{donor.name} {donor.surname}</Table.Td>
            <Table.Td>{donor.email}</Table.Td>
            <Table.Td w={85}>
                <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                        setDeleteTarget(donor);
                        setIsModalOpen(true);
                    }}
                >
                    Delete
                </Button>
            </Table.Td>
            <Table.Td w={85}>
                <Button
                    size="xs"
                    onClick={() => router.push(`/admin/donors/${donor.userId}`)}
                >
                    Edit
                </Button>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Container>
            <Title order={2} mb="md">Donors</Title>

            <Table striped highlightOnHover withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Delete</Table.Th>
                        <Table.Th>Edit</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>

            <Modal
                opened={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Confirm Delete"
                centered
            >
                <Text mb="md">
                    Are you sure you want to delete{" "}
                    <strong>{deleteTarget?.name} {deleteTarget?.surname}</strong>?
                </Text>
                <Group mt="md">
                    <Button variant="default" onClick={() => setIsModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button color="red" onClick={handleDelete}>
                        Delete
                    </Button>
                </Group>
            </Modal>
        </Container>
    );
}
