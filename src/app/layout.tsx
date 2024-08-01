import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TaskContextProvider from "@/contexts/task-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Workflo!",
  description: "No. 1 Task Management App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-[#f7f7f7] ${inter.className}`}>
        <TaskContextProvider>{children}</TaskContextProvider>
      </body>
    </html>
  );
}
