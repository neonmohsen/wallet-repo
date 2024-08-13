// app/layout.tsx
import React from "react";
import "./globals.css";

export const metadata = {
    title: "Crypto Wallet Analytics",
    description: "Analyze and explore wallet data in a modern interface.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <main>{children}</main>
            </body>
        </html>
    );
}
