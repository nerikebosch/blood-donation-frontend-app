"use client";

import Link from 'next/link'

import {
    Button,
    Checkbox,
    Paper,
    Center,
    PasswordInput,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import classes from '../../styles/LoginPage.module.css';
import {useState} from "react";
import { useRouter} from "next/navigation";

export function LoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token); // Save token for future requests
            router.push('/homepage');
        } catch (err) {
            console.error(err);
            setError('Invalid credentials');
        }
    };


    return (
        <div className={classes.wrapper}>
            <Paper className={classes.form}>
                <Title order={2} className={classes.title}>
                    Welcome back to Red Hope
                </Title>
                    <Center>
                        <TextInput label="Username" placeholder="username" size="md" radius="md" w={400} value={username} onChange={(e) => setUsername(e.currentTarget.value)} />
                    </Center>
                    <Center>
                        <PasswordInput label="Password" placeholder="Your password" mt="md" size="md" radius="md" w={400} value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
                    </Center>
                <Center>
                    <Checkbox label="Keep me logged in" mt="xl" size="md" />
                </Center>

                <Center>
                    <Button  mt="xl" size="md" radius="md" w={400} onClick={handleLogin}>
                        Login
                    </Button>
                </Center>

                {error && (
                    <Text ta="center" mt="md">
                        {error}
                    </Text>
                )}


                <Text ta="center" mt="md">
                    Don&apos;t have an account?{' '}
                    <Link href="/registerpage">
                        Register
                    </Link>
                </Text>
            </Paper>
        </div>
    );
}