import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import App from "next/app";
import { AppProviders } from "@/components/providers/AppProviders";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nex Crawl",
  description: "Next version of web crawl with AI parse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={"/sign-in"}
      appearance={
        {
          elements: {
            formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm !shadow-none",
          }
        }
      }
    >
      <Analytics />
      <html lang="en">
        <body className={inter.className}>
          
          <AppProviders>
          {children}
          </AppProviders>
        </body>
        <Toaster richColors />
      </html>
    </ClerkProvider>
  );
}
