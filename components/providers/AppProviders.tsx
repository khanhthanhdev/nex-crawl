"use client"

import * as React from "react"
import { ThemeProvider } from "next-themes"

export function AppProviders({
  children
}: {children: React.ReactNode}) {
  return (
        <ThemeProvider attribute="class" defaultTheme="system">
            {children}
        </ThemeProvider>
  )
}
