'use client';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import {
    Container,
    Title,
    Card,
    Table,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';

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
    testType: MedicalTestType;
    result: MedicalTestResult;
    testDate: string;
    notes: string;
}

export default function PatientMedicalReportsPage() {
    const { token } = useAuth();
    const [medicalTests, setMedicalTests] = useState<MedicalTest[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/medical-tests/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then(setMedicalTests)
            .catch((err) => console.error('Failed to fetch medical reports', err));
    }, []);

    const rows = medicalTests.map((test) => (
        <Table.Tr key={test.id}>
            <Table.Td>{test.testType}</Table.Td>
            <Table.Td>{test.result}</Table.Td>
            <Table.Td>{test.testDate}</Table.Td>
            <Table.Td>{test.notes}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Container>
            <Title order={2} my="md">My Medical Reports</Title>

            <Card withBorder>
                <Table striped highlightOnHover withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Test Type</Table.Th>
                            <Table.Th>Result</Table.Th>
                            <Table.Th>Date</Table.Th>
                            <Table.Th>Notes</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Card>
        </Container>
    );
}
