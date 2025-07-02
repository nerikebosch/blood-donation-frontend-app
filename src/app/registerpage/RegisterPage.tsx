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

    // values for registering the user

    const { login } = useAuth();

    const nextStep = () => setActive((current) => (current < 1 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    async function handleRegister() {
        try {
            // 1) Register user (username, email, password, role)
            if (formData.password !== formData.confirmPassword) {
                alert("Passwords do not match");
                return;
            }

            const registerResponse = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
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
                console.error("Register error response:", errorText);
                throw new Error(`Register failed: ${errorText}`);
            }

            if (!registerResponse.ok) throw new Error('Register failed');
            const registerResult = await registerResponse.json();

            const userId = registerResult.userId; // assuming backend returns created user ID

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

            const role = loginResult.role || "ROLE_DONOR"; // fallback

            login(token,role)

            // 2) Create donor profile using userId
            console.log("DOB type:", typeof formData.dateOfBirth, formData.dateOfBirth);
            console.log("userId: " , userId);

            const donorProfileResponse = await fetch('http://localhost:8080/api/donor-profiles', {
                method: 'POST',
                headers: {'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`},
                body: JSON.stringify({
                    userId: userId,
                    ethnicity: formData.ethnicity,
                    bloodType: formData.bloodType,
                    dateOfBirth: formData.dateOfBirth?? null,
                    gender: formData.gender,
                    address: formData.address,
                    lastDonationDate: null, // or formData.lastDonationDate
                }),
            });
            if (!donorProfileResponse.ok) throw new Error('Creating donor profile failed');

            // On success
            router.push('/donor/homepage');
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("An unexpected error occurred");
            }
        }
    }

    const dateInputStyles = {
        dropdown: {
            backgroundColor: 'white',
            border: '1px solid #ced4da',
            maxWidth: '300px',
            width: 'auto'
        },
        calendar: {
            maxWidth: '280px'
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
            minWidth: '30px',
            fontSize: '16px',
            color: 'black',
            alignSelf: 'center',
        },
        calendarHeaderLevel: {
            fontSize: '16px',
            fontWeight: 500,
            color: 'black',
            alignSelf: 'center',
        },
        monthPickerControl: {
            fontSize: '14px',
            height: '30px',
            color: 'black',
            alignSelf: 'center',
        },
        yearPickerControl: {
            fontSize: '14px',
            height: '30px'

        },
        monthsListControl: {
            fontSize: '14px',
            height: '30px',
            color: 'black',
        },
        yearsListControl: {
            fontSize: '14px',
            height: '30px',
            color: 'black',
        },
        day: {
            color: 'black',
            fontSize: '14px',
            width: '35px',
            height: '35px'
        },
        weekday: {
            color: '#666',
            fontSize: '12px',
            fontWeight: 600
        }
    };

    return (
        <div className={classes.wrapper}>
            <Paper className={classes.form}>
                <Title className={classes.title}>
                    Register Now
                </Title>
                <Center>
                    <Stepper active={active} onStepClick={setActive}>
                        <Stepper.Step label="Basic Information">
                            <TextInput label="Name" placeholder="Name" value={formData.name} onChange={(event) => setFormData({...formData, name: event.currentTarget.value})}/>
                            <TextInput label="Surname" placeholder="Surname" value={formData.surname} onChange={(event) => setFormData({...formData, surname: event.currentTarget.value})}/>
                            <TextInput label="Username" placeholder="Username" value={formData.username} onChange={(event) => setFormData({...formData, username: event.currentTarget.value})}/>
                            <TextInput label="Email" placeholder="Email" value={formData.email} onChange={(event) => setFormData({...formData, email: event.currentTarget.value})}/>
                            <TextInput label="Address" placeholder="Address" value={formData.address} onChange={(event) => setFormData({...formData, address: event.currentTarget.value})}/>
                            <PasswordInput label="Password" placeholder="Password" value={formData.password} onChange={(event) => setFormData({...formData, password: event.currentTarget.value})}/>
                            <PasswordInput label="Confirm Password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={(event) => setFormData({...formData, confirmPassword: event.currentTarget.value})}/>
                        </Stepper.Step>

                        <Stepper.Step label="Medical Information">
                            <DateInput label="Date of Birth" placeholder="Pick a date of Birth" value={formData.dateOfBirth} onChange={(val) => setFormData({ ...formData, dateOfBirth: val as Date | null})} styles={dateInputStyles} />
                            <Select label="Ethnicity" data={['White', 'Asian', 'Black / African', 'Mixed', 'Other', 'Prefer not to say']} value={formData.ethnicity} onChange={(val) => setFormData({ ...formData, ethnicity: val || '' })}/>
                            <Select label="Blood Type" data={['A+', 'A-', 'O+', 'O-', 'B+', 'B-', 'AB+', 'AB-']} value={formData.bloodType} onChange={(val) => setFormData({ ...formData, bloodType: val || '' })} styles={{ dropdown: { backgroundColor: 'white'}, option:{color: 'black'}}}/>
                            <Select label="Gender" data={['Male', 'Female', 'Other']} value={formData.gender} onChange={(val) => setFormData({ ...formData, gender: val || '' })}/>
                        </Stepper.Step>
                    </Stepper>
                </Center>
                <Center>
                    <Group mt="xl">
                        {active !== 0 && <Button w={140} onClick={prevStep}>Go Back</Button>}
                        {active !== 1 ? (
                            <Button w={140} onClick={nextStep}>
                                Continue
                            </Button>
                        ) : (
                            <Button w={140} onClick={ handleRegister }>
                                Submit
                            </Button>
                        )}

                    </Group>
                </Center>
                <Text ta="center" mt="xs" size="sm" className={classes.text}>
                    <Link href="/loginpage">
                        Already have an account? Login
                    </Link>
                </Text>
            </Paper>
        </div>
    )
}