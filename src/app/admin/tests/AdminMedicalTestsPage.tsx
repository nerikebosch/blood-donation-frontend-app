'use client';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import {
    Container,
    Title,
    Select,
    TextInput,
    Textarea,
    Button,
    Grid,
    Card,
    Group,
    Box,
    Table,
    SelectItem,
    Modal,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';

interface Donor {
    id: number;
    name: string;
    surname: string;
    email: string;
}

type MedicalTestType =
    | 'HEMOGLOBIN'
    | 'HIV'
    | 'BLOOD_PRESSURE'
    | 'HEPATITIS_B'
    | 'HEPATITIS_C'
    | 'SYPHILIS';

type MedicalTestResult =
    | 'NORMAL'
    | 'LOW'
    | 'HIGH'
    | 'POSITIVE'
    | 'NEGATIVE';

interface MedicalTest {
    id: number;
    donorId: number;
    testType: MedicalTestType;
    result: MedicalTestResult;
    testDate: string;
    notes: string;
    donorName?: string;
}

function validateForm({
                          donorId,
                          testType,
                          result,
                          testDate,
                          notes,
                      }: {
    donorId: string | null;
    testType: MedicalTestType | null;
    result: MedicalTestResult | null;
    testDate: Date | null;
    notes: string;
}): string[] {
    const errors: string[] = [];

    if (!donorId) errors.push('Donor is required.');
    if (!testType) errors.push('Test type is required.');
    if (!result) errors.push('Result is required.');
    if (!testDate) {
        errors.push('Test date is required.');
    } else {
        const today = new Date();
        if (testDate > today) {
            errors.push('Test date cannot be in the future.');
        }
    }

    if (notes.length > 500) {
        errors.push('Notes must be 500 characters or fewer.');
    }

    return errors;
}


export default function AdminMedicalTestsPage() {
    const { token } = useAuth();
    const [donors, setDonors] = useState<Donor[]>([]);
    const [selectedDonorId, setSelectedDonorId] = useState<string | null>(null);
    const [testType, setTestType] = useState<MedicalTestType | null>(null);
    const [result, setResult] = useState<MedicalTestResult | null>(null);
    const [testDate, setTestDate] = useState<Date | null>(null);
    const [notes, setNotes] = useState('');
    const [medicalTests, setMedicalTests] = useState<MedicalTest[]>([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editTest, setEditTest] = useState<MedicalTest | null>(null);


    // Fetch donors
    useEffect(() => {
        fetch('http://localhost:8080/api/user/all', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then(setDonors)
            .catch((err) => console.error('Failed to fetch donors', err));
    }, []);

    // Fetch all medical tests
    useEffect(() => {
        fetch('http://localhost:8080/api/medical-tests/all', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then(setMedicalTests)
            .catch((err) => console.error('Failed to fetch tests', err));
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this report?')) return;

        try {
            const res = await fetch(`http://localhost:8080/api/medical-tests/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error('Failed to delete test');

            setMedicalTests((prev) => prev.filter((t) => t.id !== id));
            alert('Medical report deleted successfully!');
        } catch (err) {
            console.error(err);
            alert('Delete failed');
        }
    };

    const handleUpdate = async () => {
        if (!editTest) return;

        const errors = validateForm({
            donorId: editTest.donorId.toString(),
            testType: editTest.testType,
            result: editTest.result,
            testDate: new Date(editTest.testDate),
            notes: editTest.notes,
        });

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/medical-tests/${editTest.id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    testType: editTest.testType,
                    result: editTest.result,
                    testDate: editTest.testDate,
                    notes: editTest.notes,
                }),
            });

            if (!res.ok) throw new Error('Update failed');

            const updated = await res.json();

            setMedicalTests((prev) =>
                prev.map((t) => (t.id === editTest.id ? { ...t, ...updated } : t))
            );

            setEditModalOpen(false);
            alert('Medical report updated!');
        } catch (err) {
            console.error(err);
            alert('Update failed');
        }
    };



    const handleCreate = async () => {
        const errors = validateForm({
            donorId: selectedDonorId,
            testType,
            result,
            testDate,
            notes,
        });

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        const payload = {
            donorId: parseInt(selectedDonorId!),
            testType,
            result,
            testDate: testDate!.toISOString().split('T')[0],
            notes,
        };

        try {
            const res = await fetch('http://localhost:8080/api/medical-tests', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to create test');

            const created = await res.json();
            setMedicalTests((prev) => [...prev, { ...created, donorName: getDonorName(created.donorId) }]);

            alert('Medical report created successfully!');

            // Reset form
            setSelectedDonorId(null);
            setTestType(null);
            setResult(null);
            setTestDate(null);
            setNotes('');
        } catch (err) {
            console.error('Create error:', err);
            alert('Failed to create medical report');
        }
    };


    const getDonorName = (id: number) => {
        const donor = donors.find((d) => d.id === id);
        return donor ? `${donor.name} ${donor.surname}` : 'Unknown';
    };

    return (

        <Container>
            <Modal
                opened={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title="Edit Medical Report"
                centered
            >
                {editTest && (
                    <Box>
                        <Select
                            label="Test Type"
                            value={editTest.testType}
                            onChange={(v) => setEditTest({ ...editTest, testType: v as MedicalTestType })}
                            data={[
                                'HEMOGLOBIN',
                                'HIV',
                                'BLOOD_PRESSURE',
                                'HEPATITIS_B',
                                'HEPATITIS_C',
                                'SYPHILIS',
                            ]}
                            mb="sm"
                        />

                        <Select
                            label="Result"
                            value={editTest.result}
                            onChange={(v) => setEditTest({ ...editTest, result: v as MedicalTestResult })}
                            data={['NORMAL', 'LOW', 'HIGH', 'POSITIVE', 'NEGATIVE']}
                            mb="sm"
                        />

                        <DateInput
                            label="Test Date"
                            value={new Date(editTest.testDate)}
                            onChange={(d) =>
                                setEditTest({ ...editTest, testDate: d?.toString().split('T')[0] || '' })
                            }
                            mb="sm"
                        />

                        <Textarea
                            label="Notes"
                            value={editTest.notes}
                            onChange={(e) =>
                                setEditTest({ ...editTest, notes: e.currentTarget.value })
                            }
                            mb="sm"
                        />

                        <Button fullWidth onClick={handleUpdate}>Save Changes</Button>
                    </Box>
                )}
            </Modal>

            <Title order={2} my="md">Medical Reports</Title>

            <Card withBorder mb="lg">
                <Title order={4} mb="sm">Create Medical Report</Title>

                <Grid gutter="md">
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Select
                            label="Select Donor"
                            placeholder="Choose donor"
                            value={selectedDonorId}
                            onChange={setSelectedDonorId}
                            data={donors.map((d) => ({
                                value: d.id.toString(),
                                label: `${d.name} ${d.surname}`,
                            }))}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 6, md: 3 }}>
                        <Select
                            label="Test Type"
                            value={testType}
                            onChange={(v) => setTestType(v as MedicalTestType)}
                            data={[
                                'HEMOGLOBIN',
                                'HIV',
                                'BLOOD_PRESSURE',
                                'HEPATITIS_B',
                                'HEPATITIS_C',
                                'SYPHILIS',
                            ]}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 6, md: 3 }}>
                        <Select
                            label="Result"
                            value={result}
                            onChange={(v) => setResult(v as MedicalTestResult)}
                            data={[
                                'NORMAL',
                                'LOW',
                                'HIGH',
                                'POSITIVE',
                                'NEGATIVE',
                            ]}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <DateInput
                            label="Test Date"
                            value={testDate}
                            onChange={setTestDate}
                        />
                    </Grid.Col>

                    <Grid.Col span={12}>
                        <Textarea
                            label="Notes"
                            placeholder="Optional notes"
                            value={notes}
                            onChange={(e) => setNotes(e.currentTarget.value)}
                        />
                    </Grid.Col>

                    <Grid.Col span={12}>
                        <Button onClick={handleCreate}>Create Medical Report</Button>
                    </Grid.Col>
                </Grid>
            </Card>

            <Card withBorder>
                <Title order={4} mb="sm">All Medical Tests</Title>
                <Table striped highlightOnHover withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Donor</Table.Th>
                            <Table.Th>Test Type</Table.Th>
                            <Table.Th>Result</Table.Th>
                            <Table.Th>Date</Table.Th>
                            <Table.Th>Notes</Table.Th>
                            <Table.Th>Edit</Table.Th>
                            <Table.Th>Delete</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {medicalTests.map((test) => (
                            <Table.Tr key={test.id}>
                                <Table.Td>{test.donorName || getDonorName(test.donorId)}</Table.Td>
                                <Table.Td>{test.testType}</Table.Td>
                                <Table.Td>{test.result}</Table.Td>
                                <Table.Td>{test.testDate}</Table.Td>
                                <Table.Td>{test.notes}</Table.Td>
                                <Table.Td w={85}>
                                    <Button
                                        size="xs"
                                        onClick={() => {
                                            setEditTest(test);
                                            setEditModalOpen(true);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </Table.Td>
                                <Table.Td w={85}>
                                    <Button
                                        variant="outline"
                                        color="red"
                                        size="xs"
                                        onClick={() => handleDelete(test.id)}
                                    >
                                        Delete
                                    </Button>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Card>
        </Container>
    );
}
