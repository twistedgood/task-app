import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Manager App",
  description: "A simple task management web application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <nav className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">Task Manager</Link>
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="hover:underline">Tasks</Link>
              </li>
              <li>
                <Link href="/kanban" className="hover:underline">Kanban</Link>
              </li>
              <li>
                <Link href="/users" className="hover:underline">Users</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-blue-600 text-white p-4 text-center shadow-md mt-auto">
          <p>&copy; {new Date().getFullYear()} Task Manager App. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
