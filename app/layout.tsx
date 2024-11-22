import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import TopNav from "@/components/nav-bar-top";
import BottomNav from "@/components/nav-bar-bottom";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Jokgu",
  description: "Jokgu app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en" className="h-full">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
        >
          <div className="h-full bg-base-200 flex flex-col">
            <TopNav />
            <div className="flex-1 mt-[1rem] mb-[4rem] overflow-y-auto">
              {children}
            </div>
            <BottomNav />
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
