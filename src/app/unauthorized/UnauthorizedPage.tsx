"use client"

import { Button, Container, SimpleGrid, Text, Title } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import classes from '../../styles/UnauthorizedPage.module.css';


export function UnauthorizedPage() {
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        setRole(storedRole);
    }, []);

    const goToHome = () => {
        if (role === 'ROLE_ADMIN') {
            router.push('/admin/homepage');
        } else if (role === 'ROLE_DONOR' || role === 'user') {
            router.push('/donor/homepage');
        } else {
            router.push('/loginpage'); // fallback general homepage
        }
    };

    return (
        <Container className={classes.root}>
            <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
                <div>
                    <Title className={classes.title}>🚫 Unauthorized Access</Title>
                    <Text c="dimmed" size="lg">
                        You don’t have permission to view this page.
                        Please login with appropriate credentials or contact support if you think this is a mistake.
                    </Text>
                    <Button
                        variant="outline"
                        size="md"
                        mt="xl"
                        className={classes.control}
                        onClick={() => router.push('/loginpage')}
                    >
                        Go to Login Page
                    </Button>
                    <Button
                        variant="light"
                        size="md"
                        mt="md"
                        className={classes.control}
                        onClick={goToHome}
                    >
                        Back to Home
                    </Button>
                </div>
            </SimpleGrid>
        </Container>
    );
}
