"use client";

import { useState } from "react";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { DateInput } from '@mantine/dates';
import {
    Button,
    TextInput,
    Paper,
    Title,
    Text,
    Center,
    Stepper,
    Group,
    PasswordInput,
    Select
} from "@mantine/core";
import classes from '../../styles/RegisterPage.module.css';
import { useAuth } from '@/lib/auth';
import Link from "next/link";
import { useRouter } from "next/navigation";

export function RegisterPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [active, setActive] = useState(0);

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        username: '',
        email: '',
        address: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: null as Date | null,
        ethnicity: '',
        bloodType: '',
        gender: '',
    });

    const nextStep = () => setActive((current) => (current < 1 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    function validateForm(): boolean {
        const errors: { [key: string]: string } = {};

        // Registration Info
        if (!formData.name.trim()) errors.name = "Name is required.";
        if (!formData.surname.trim()) errors.surname = "Surname is required.";
        if (!formData.username.trim()) errors.username = "Username is required.";
        if (!formData.email.trim()) errors.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email format.";
        if (!formData.password) errors.password = "Password is required.";
        if (!formData.confirmPassword) errors.confirmPassword = "Please confirm your password.";
        else if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match.";

        // Donor Profile Info
        if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required.";
        if (!formData.ethnicity) errors.ethnicity = "Ethnicity is required.";
        if (!formData.bloodType) errors.bloodType = "Blood type is required.";
        if (!formData.gender) errors.gender = "Gender is required.";
        if (!formData.address.trim()) errors.address = "Address is required.";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    async function handleRegister() {
        try {
            if (!validateForm()) return;

            const registerResponse = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: formData.password,
                    username: formData.username,
                    role: "ROLE_DONOR",
                    email: formData.email,
                    name: formData.name,
                    surname: formData.surname
                }),
            });

            if (!registerResponse.ok) {
                const errorText = await registerResponse.text();
                try {
                    const backendErrors = JSON.parse(errorText);
                    if (typeof backendErrors === 'object') {
                        setFormErrors(prev => ({ ...prev, ...backendErrors }));
                    } else {
                        alert("Register failed:\n" + errorText);
                    }
                } catch {
                    alert("Register failed:\n" + errorText);
                }
                return;
            }

            const registerResult = await registerResponse.json();
            const userId = registerResult.userId;

            const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                })
            });

            if (!loginResponse.ok) throw new Error("Login failed after registration");

            const loginResult = await loginResponse.json();
            const token = loginResult.token;
            const role = loginResult.role || "ROLE_DONOR";

            login(token, role);

            const donorProfileResponse = await fetch('http://localhost:8080/api/donor-profiles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId,
                    ethnicity: formData.ethnicity,
                    bloodType: formData.bloodType,
                    dateOfBirth: formData.dateOfBirth,
                    gender: formData.gender,
                    address: formData.address,
                    lastDonationDate: null,
                }),
            });

            if (!donorProfileResponse.ok) throw new Error('Creating donor profile failed');

            router.push('/donor/homepage');
        } catch (error) {
            alert(error instanceof Error ? error.message : "An unexpected error occurred");
        }
    }

    const dateInputStyles = {
        dropdown: { backgroundColor: 'white', border: '1px solid #ced4da', maxWidth: '300px' },
        calendar: { maxWidth: '280px' },
        calendarHeader: { color: 'black' },
        calendarHeaderControl: { color: 'black' },
        calendarHeaderLevel: { color: 'black' },
        day: { color: 'black' },
        weekday: { color: '#666' }
    };

    return (
        <div className={classes.wrapper}>
            <Paper className={classes.form}>
                <Title className={classes.title}>Register Now</Title>
                <Center>
                    <Stepper active={active} onStepClick={setActive}>
                        <Stepper.Step label="Basic Information">
                            <TextInput label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.currentTarget.value })} error={formErrors.name} />
                            <TextInput label="Surname" value={formData.surname} onChange={(e) => setFormData({ ...formData, surname: e.currentTarget.value })} error={formErrors.surname} />
                            <TextInput label="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.currentTarget.value })} error={formErrors.username} />
                            <TextInput label="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.currentTarget.value })} error={formErrors.email} />
                            <TextInput label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.currentTarget.value })} error={formErrors.address} />
                            <PasswordInput label="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.currentTarget.value })} error={formErrors.password} />
                            <PasswordInput label="Confirm Password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.currentTarget.value })} error={formErrors.confirmPassword} />
                        </Stepper.Step>

                        <Stepper.Step label="Medical Information">
                            <DateInput
                                label="Date of Birth"
                                value={formData.dateOfBirth}
                                onChange={(val) => setFormData({ ...formData, dateOfBirth: val })}
                                styles={dateInputStyles}
                                error={formErrors.dateOfBirth}
                            />
                            <Select
                                label="Ethnicity"
                                data={['White', 'Asian', 'Black / African', 'Mixed', 'Other', 'Prefer not to say']}
                                value={formData.ethnicity}
                                onChange={(val) => setFormData({ ...formData, ethnicity: val || '' })}
                                error={formErrors.ethnicity}
                            />
                            <Select
                                label="Blood Type"
                                data={['A+', 'A-', 'O+', 'O-', 'B+', 'B-', 'AB+', 'AB-']}
                                value={formData.bloodType}
                                onChange={(val) => setFormData({ ...formData, bloodType: val || '' })}
                                error={formErrors.bloodType}
                            />
                            <Select
                                label="Gender"
                                data={['Male', 'Female', 'Other']}
                                value={formData.gender}
                                onChange={(val) => setFormData({ ...formData, gender: val || '' })}
                                error={formErrors.gender}
                            />
                        </Stepper.Step>
                    </Stepper>
                </Center>

                <Center>
                    <Group mt="xl">
                        {active !== 0 && <Button w={140} onClick={prevStep}>Go Back</Button>}
                        {active !== 1 ? (
                            <Button w={140} onClick={nextStep}>Continue</Button>
                        ) : (
                            <Button w={140} onClick={handleRegister}>Submit</Button>
                        )}
                    </Group>
                </Center>

                <Text ta="center" mt="xs" size="sm" className={classes.text}>
                    <Link href="/loginpage">Already have an account? Login</Link>
                </Text>
            </Paper>
        </div>
    );
}
