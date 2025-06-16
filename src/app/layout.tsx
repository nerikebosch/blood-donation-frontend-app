"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { MantineProvider, createTheme } from "@mantine/core";
import "./globals.css";

// Import Mantine CSS
import '@mantine/core/styles.css';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Create theme
const theme = createTheme({
    fontFamily: 'Outfit, var(--mantine-font-family)',

    // Add other theme customizations here
    components: {
        Select: {
            styles: {
                dropdown: {
                    backgroundColor: 'white',
                    border: '1px solid #ced4da'
                },
                option: {
                    color: 'black',
                    '&:hover': {
                        backgroundColor: '#f8f9fa',
                        color: 'black'
                    }
                }
            }
        },
        DateInput: {
            styles: {
                dropdown: {
                    backgroundColor: 'white',
                    border: '1px solid #ced4da'
                },
                day: {
                    color: 'black',
                    '&:hover': {
                        backgroundColor: '#f8f9fa',
                        color: 'black'
                    }
                }
            }
        }
    }
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head />
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MantineProvider theme={theme} defaultColorScheme="light">
            {children}
        </MantineProvider>
        </body>
        </html>
    );
}