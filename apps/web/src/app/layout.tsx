import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UMS – University Management System",
  description: "Industrial-grade University Management System with role-based access, academics, housing, and real-time communication.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
